// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ─────────────────────────────────────────────────────────────────────────────
//  WLD5050.sol — v3 FINAL (ETHGlobal New York 2026)
//  The first human-verified, fully automated 50/50 raffle on World Chain.
//
//  ┌─────────────────────────────────────────────────────────────────────────┐
//  │  INTEGRATION MAP                                                        │
//  │                                                                         │
//  │  World ID 4.0    → IWorldID.verifyProof()   1 human per create & ticket   │
//  │  Chainlink CRE   → IReceiver.onReport()     automated settlement        │
//  │  ENS             → winnerSubname emitted     frontend mints subname      │
//  └─────────────────────────────────────────────────────────────────────────┘
//
//  ┌─────────────────────────────────────────────────────────────────────────┐
//  │  ECONOMIC MODEL                                                         │
//  │                                                                         │
//  │                    USDC raffle          WLD raffle                      │
//  │  Creation fee      $10.00 USDC          10.00 WLD → wld5050.eth         │
//  │  Ticket price       $2.50 USDC           2.50 WLD → escrow             │
//  │  Winner receives   50% ticket revenue   50% ticket revenue              │
//  │  Creator receives  50% ticket revenue   50% ticket revenue              │
//  │  Settlement        PUSH — automatic     PUSH — automatic                │
//  │  Claiming step     NONE                 NONE                            │
//  └─────────────────────────────────────────────────────────────────────────┘
//
//  ┌─────────────────────────────────────────────────────────────────────────┐
//  │  WORLD CHAIN MAINNET ADDRESSES (confirmed worldscan.org)                │
//  │                                                                         │
//  │  USDC   0x79A02482A880bCE3F13e09Da970dC34db4CD24d1  (6 decimals)       │
//  │  WLD    0x2cFc85d8E48F8EAB294be644d9E25C3030863003  (18 decimals)       │
//  │  WorldIDRouter  confirm with World team at booth                        │
//  │  CRE Forwarder  confirm with Chainlink team at booth                    │
//  └─────────────────────────────────────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────────────────────

import { IWorldID }       from "./interfaces/IWorldID.sol";
import { IReceiver }      from "./interfaces/IReceiver.sol";
import { ByteHasher }     from "./libraries/ByteHasher.sol";
import { IERC20 }         from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 }      from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC165 }        from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { Ownable }        from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract WLD5050 is IReceiver, IERC165, Ownable, ReentrancyGuard {
    using ByteHasher for bytes;
    using SafeERC20  for IERC20;

    // ─── ERRORS ───────────────────────────────────────────────────────────────
    error InvalidNullifier();
    error AlreadySettled();
    error RaffleNotEnded();
    error RaffleNotActive();
    error InvalidRaffleId();
    error OnlyForwarder();
    error EmergencyWindowNotOpen();
    error AlreadyRefunded();
    error NotATicketBuyer();
    error DurationOutOfRange();
    error NameTooLong();

    // ─── EVENTS ───────────────────────────────────────────────────────────────
    event RaffleCreated(
        uint256 indexed raffleId,
        address indexed creator,
        PaymentToken    token,
        uint256         endTime,
        string          name
    );
    event TicketPurchased(
        uint256 indexed raffleId,
        address indexed buyer,
        uint256         ticketIndex
    );
    event RaffleSettled(
        uint256 indexed raffleId,
        address indexed winner,
        address indexed creator,
        PaymentToken    token,
        uint256         winnerPrize,
        uint256         creatorPayout,
        bytes32         aiAttestationHash,
        string          winnerSubname        // e.g. "winner-round42.wld5050.eth"
    );
    event RaffleExpired(uint256 indexed raffleId);
    event EmergencyRefund(
        uint256 indexed raffleId,
        address indexed buyer,
        uint256         amount,
        PaymentToken    token
    );

    // ─── ENUMS ────────────────────────────────────────────────────────────────

    /// @notice Payment token for a raffle — fixed at creation, immutable for its lifetime
    enum PaymentToken { USDC, WLD }

    enum RaffleStatus { ACTIVE, SETTLED, EXPIRED }

    // ─── STRUCTS ──────────────────────────────────────────────────────────────

    struct Raffle {
        string        name;
        address       creator;           // receives 50% of ticket revenue on settlement
        PaymentToken  token;             // USDC or WLD — all tickets use same token
        uint256       endTime;           // Unix timestamp — enforced by Solidity
        uint256       ticketsSold;
        RaffleStatus  status;
        bytes32       aiAttestationHash; // Chainlink Confidential AI — written onchain
        string        winnerSubname;     // "winner-round{N}.wld5050.eth"
    }

    // ─── CONSTANTS ────────────────────────────────────────────────────────────

    // USDC — 6 decimals
    // World Chain Mainnet: 0x79A02482A880bCE3F13e09Da970dC34db4CD24d1
    uint256 public constant PLATFORM_FEE_USDC = 10_000_000;   // $10.00 USDC
    uint256 public constant TICKET_PRICE_USDC  =  2_500_000;  //  $2.50 USDC

    // WLD — 18 decimals
    // World Chain Mainnet: 0x2cFc85d8E48F8EAB294be644d9E25C3030863003
    uint256 public constant PLATFORM_FEE_WLD  = 10 ether;     // 10.00 WLD
    uint256 public constant TICKET_PRICE_WLD  =  2.5 ether;   //  2.50 WLD

    // Duration: any positive length (1 minute demo → 1 year+ long-running raffles)
    uint256 public constant MIN_DURATION     = 1;

    // Emergency refund: callable 48h after round end if CRE hasn't settled
    uint256 public constant EMERGENCY_WINDOW = 48 hours;

    // World ID: Orb-verified humans only (not Device-verified)
    uint256 public constant WORLD_GROUP_ID   = 1;

    // World ID app identifier — must match NEXT_PUBLIC_WLD_APP_ID in Developer Portal
    string  public constant APP_ID           = "app_c35299664a4b822ecab303d0564cd15b";
    // RP ID (rp_…) is server-only (WORLD_RP_ID) for IDKit v4 proof requests — not stored on-chain

    // Max raffle name length
    uint256 public constant MAX_NAME_LENGTH  = 64;

    // ─── STATE ────────────────────────────────────────────────────────────────

    uint256 public raffleCount;

    mapping(uint256 => Raffle)                           public raffles;
    mapping(uint256 => address[])                        public raffleEntries;
    mapping(uint256 => mapping(uint256 => bool))         public nullifierUsed;
    // raffleId → nullifierHash → bool (1 entry per World ID per raffle)

    mapping(uint256 => mapping(address => bool))         public refundClaimed;
    // raffleId → buyer → claimed (emergency refund tracker)

    // ─── IMMUTABLES ───────────────────────────────────────────────────────────

    /// @notice WorldIDRouter on World Chain
    /// World Chain Sepolia:  0x469449f251692E0779667583026b5A1E99512157
    /// World Chain Mainnet:  confirm with World team at booth
    IWorldID public immutable worldId;

    /// @notice USDC on World Chain: 0x79A02482A880bCE3F13e09Da970dC34db4CD24d1
    IERC20 public immutable usdc;

    /// @notice WLD on World Chain: 0x2cFc85d8E48F8EAB294be644d9E25C3030863003
    IERC20 public immutable wld;

    /// @notice Chainlink CRE KeystoneForwarder
    /// Get this address from the Chainlink booth — it's chain-specific
    /// Only this address can call onReport() — all others revert
    address public immutable creForwarder;

    /// @notice Platform wallet — receives all creation fees
    /// Set to the resolved address of wld5050.eth
    address public platformWallet;

    // ─── CONSTRUCTOR ──────────────────────────────────────────────────────────

    constructor(
        address _worldId,
        address _usdc,
        address _wld,
        address _creForwarder,
        address _platformWallet
    ) Ownable(msg.sender) {
        worldId        = IWorldID(_worldId);
        usdc           = IERC20(_usdc);
        wld            = IERC20(_wld);
        creForwarder   = _creForwarder;
        platformWallet = _platformWallet;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  STEP 1 — CREATE RAFFLE
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Create a 50/50 raffle — requires World ID 4.0 ZK proof and creation fee
    ///
    /// @dev Before calling, approve this contract:
    ///      USDC: usdc.approve(address(this), 10_000_000)
    ///      WLD:  wld.approve(address(this), 10 ether)
    ///
    /// @param name           Raffle display name — max 64 chars, shown in UI as ENS-resolved
    /// @param duration       Seconds until raffle closes — any value ≥ 1 second
    /// @param token          PaymentToken.USDC (0) or PaymentToken.WLD (1)
    /// @param root           World ID Merkle root — from IDKit widget response
    /// @param nullifierHash  World ID nullifier for this create action
    /// @param proof          ZK proof uint256[8] — from IDKit widget output
    ///
    /// @return raffleId  Share as wld5050.com/raffle/{raffleId}
    function createRaffle(
        string   calldata name,
        uint256           duration,
        PaymentToken      token,
        uint256           root,
        uint256           nullifierHash,
        uint256[8] calldata proof
    ) external nonReentrant returns (uint256 raffleId) {

        if (duration < MIN_DURATION)
            revert DurationOutOfRange();
        if (bytes(name).length == 0 || bytes(name).length > MAX_NAME_LENGTH)
            revert NameTooLong();

        // ── World ID verification ─────────────────────────────────────────────
        // externalNullifierHash = hash(hashToField(APP_ID) + "create-raffle")
        uint256 externalNullifierHash = abi
            .encodePacked(abi.encodePacked(APP_ID).hashToField(), "create-raffle")
            .hashToField();

        worldId.verifyProof(
            root,
            WORLD_GROUP_ID,
            abi.encodePacked(msg.sender).hashToField(),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        // Pull creation fee from creator → platform wallet (wld5050.eth)
        if (token == PaymentToken.USDC) {
            usdc.safeTransferFrom(msg.sender, platformWallet, PLATFORM_FEE_USDC);
        } else {
            wld.safeTransferFrom(msg.sender, platformWallet, PLATFORM_FEE_WLD);
        }

        raffleId = ++raffleCount;

        raffles[raffleId] = Raffle({
            name:              name,
            creator:           msg.sender,
            token:             token,
            endTime:           block.timestamp + duration,
            ticketsSold:       0,
            status:            RaffleStatus.ACTIVE,
            aiAttestationHash: bytes32(0),
            winnerSubname:     ""
        });

        emit RaffleCreated(raffleId, msg.sender, token, block.timestamp + duration, name);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  STEP 2 — BUY TICKET  (World ID ZK proof required)
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Buy one ticket — requires valid World ID 4.0 ZK proof
    ///
    /// @dev Before calling, approve this contract:
    ///      USDC raffle: usdc.approve(address(this), 2_500_000)
    ///      WLD  raffle: wld.approve(address(this), 2.5 ether)
    ///
    /// @dev World ID proof is scoped per raffle:
    ///      - Same human CAN enter DIFFERENT raffles (nullifier is raffle-scoped)
    ///      - Same human CANNOT enter the SAME raffle twice (InvalidNullifier revert)
    ///
    /// @param raffleId      The raffle to enter
    /// @param root          World ID Merkle root — from IDKit widget response
    /// @param nullifierHash Unique per (human × raffle) — stored to prevent re-entry
    /// @param proof         ZK proof uint256[8] — from IDKit widget output
    function buyTicket(
        uint256            raffleId,
        uint256            root,
        uint256            nullifierHash,
        uint256[8] calldata proof
    ) external nonReentrant {

        // Validate raffle state
        if (raffleId == 0 || raffleId > raffleCount) revert InvalidRaffleId();
        Raffle storage raffle = raffles[raffleId];
        if (raffle.status != RaffleStatus.ACTIVE)    revert RaffleNotActive();
        if (block.timestamp >= raffle.endTime)        revert RaffleNotActive();

        // ── World ID verification ─────────────────────────────────────────────
        // Reject duplicate entries from same World ID for this raffle
        if (nullifierUsed[raffleId][nullifierHash]) revert InvalidNullifier();

        // Scope proof to this specific raffle (World ID onchain-template formula)
        // externalNullifierHash = hash(hashToField(APP_ID) + "enter-raffle-" + raffleId)
        uint256 externalNullifierHash = abi
            .encodePacked(abi.encodePacked(APP_ID).hashToField(), "enter-raffle-", _toString(raffleId))
            .hashToField();

        // Verify ZK proof onchain via WorldIDRouter
        // This call REVERTS if proof is invalid — execution stops here
        // GroupId 1 = Orb-verified humans only
        worldId.verifyProof(
            root,
            WORLD_GROUP_ID,
            abi.encodePacked(msg.sender).hashToField(), // signal = buyer address
            nullifierHash,
            externalNullifierHash,
            proof
        );

        // Store nullifier — this human cannot enter this raffle again
        nullifierUsed[raffleId][nullifierHash] = true;

        // ── Pull ticket payment into contract escrow ──────────────────────────
        if (raffle.token == PaymentToken.USDC) {
            usdc.safeTransferFrom(msg.sender, address(this), TICKET_PRICE_USDC);
        } else {
            wld.safeTransferFrom(msg.sender, address(this), TICKET_PRICE_WLD);
        }

        // Record entry
        raffleEntries[raffleId].push(msg.sender);
        raffle.ticketsSold++;

        emit TicketPurchased(raffleId, msg.sender, raffle.ticketsSold - 1);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  STEP 3 — AUTOMATED SETTLEMENT  (Chainlink CRE → IReceiver.onReport)
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Called by Chainlink CRE KeystoneForwarder after DON consensus
    ///
    /// @dev Security: ONLY creForwarder can call this — all others revert OnlyForwarder()
    /// @dev ERC165: contract declares IReceiver support for Forwarder validation
    ///
    /// @dev CRE workflow encodes report as:
    ///      abi.encode(uint256 raffleId, uint256 winnerIndex, bytes32 aiAttestationHash)
    ///
    /// @dev Settlement branches:
    ///      ticketsSold == 0  → marks EXPIRED, emits RaffleExpired, no transfers
    ///      ticketsSold >= 1  → selects winner, PUSHES 50% to winner + 50% to creator
    ///                          both payments atomic in this transaction
    ///                          emits RaffleSettled with winnerSubname for ENS minting
    ///
    /// @dev First calldata argument is CRE workflow metadata — reserved for replay protection (future use)
    /// @param report    ABI-encoded (raffleId, winnerIndex, aiAttestationHash)
    function onReport(
        bytes calldata /* metadata */,
        bytes calldata report
    ) external override nonReentrant {

        if (msg.sender != creForwarder) revert OnlyForwarder();

        // Decode CRE workflow report
        (uint256 raffleId, uint256 winnerIndex, bytes32 aiAttestationHash) =
            abi.decode(report, (uint256, uint256, bytes32));

        Raffle storage raffle = raffles[raffleId];

        // Validate settlement conditions
        if (raffle.status != RaffleStatus.ACTIVE) revert AlreadySettled();
        if (block.timestamp < raffle.endTime)     revert RaffleNotEnded();

        // ── Branch A: 0 tickets sold → expire raffle, no draw ─────────────────
        if (raffle.ticketsSold == 0) {
            raffle.status = RaffleStatus.EXPIRED;
            emit RaffleExpired(raffleId);
            return;
        }

        // ── Branch B: 1+ tickets → full settlement ────────────────────────────
        address[] storage entries = raffleEntries[raffleId];

        // Safe modulo — guards against winnerIndex overflow
        address winner = entries[winnerIndex % raffle.ticketsSold];

        // Compute 50/50 split in the raffle's token
        uint256 ticketPrice   = raffle.token == PaymentToken.USDC
            ? TICKET_PRICE_USDC : TICKET_PRICE_WLD;
        uint256 totalRevenue  = raffle.ticketsSold * ticketPrice;
        uint256 winnerPrize   = totalRevenue / 2;
        uint256 creatorPayout = totalRevenue - winnerPrize; // remainder → creator

        // Store AI attestation hash onchain — verifiable by anyone
        raffle.aiAttestationHash = aiAttestationHash;

        // Build winner ENS subname string
        // Frontend listens for RaffleSettled and mints this on ENS L1
        string memory winnerSub = string(
            abi.encodePacked("winner-round", _toString(raffleId), ".wld5050.eth")
        );
        raffle.winnerSubname = winnerSub;

        // Mark SETTLED before transfers — reentrancy protection
        raffle.status = RaffleStatus.SETTLED;

        // ── PUSH payments — atomic, no claiming, no friction ──────────────────
        IERC20 payToken = raffle.token == PaymentToken.USDC ? usdc : wld;

        payToken.safeTransfer(winner,        winnerPrize);   // 50% → winner
        payToken.safeTransfer(raffle.creator, creatorPayout); // 50% → creator

        emit RaffleSettled(
            raffleId,
            winner,
            raffle.creator,
            raffle.token,
            winnerPrize,
            creatorPayout,
            aiAttestationHash,
            winnerSub
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  EMERGENCY REFUND — trustless backstop, no admin needed
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Full refund for ticket buyers if CRE fails to settle within 48h
    /// @dev Callable by any ticket buyer — no admin, no trust required
    /// @dev Raffle must be ACTIVE + past endTime + past 48h emergency window
    function emergencyRefund(uint256 raffleId) external nonReentrant {
        Raffle storage raffle = raffles[raffleId];

        if (raffle.status != RaffleStatus.ACTIVE)                revert AlreadySettled();
        if (block.timestamp < raffle.endTime + EMERGENCY_WINDOW) revert EmergencyWindowNotOpen();
        if (refundClaimed[raffleId][msg.sender])                  revert AlreadyRefunded();

        // Verify caller actually bought a ticket
        bool isBuyer;
        address[] storage entries = raffleEntries[raffleId];
        for (uint256 i; i < entries.length; i++) {
            if (entries[i] == msg.sender) { isBuyer = true; break; }
        }
        if (!isBuyer) revert NotATicketBuyer();

        refundClaimed[raffleId][msg.sender] = true;

        IERC20  payToken   = raffle.token == PaymentToken.USDC ? usdc : wld;
        uint256 ticketPrice = raffle.token == PaymentToken.USDC
            ? TICKET_PRICE_USDC : TICKET_PRICE_WLD;

        payToken.safeTransfer(msg.sender, ticketPrice);

        emit EmergencyRefund(raffleId, msg.sender, ticketPrice, raffle.token);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  READ FUNCTIONS — called by Chainlink CRE workflow
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice All raffleIds that have ended and are still ACTIVE (need settlement)
    /// @dev CRE cron workflow calls this on a 30-second schedule to find work to do
    function getExpiredRaffles() external view returns (uint256[] memory ids) {
        uint256 count;
        for (uint256 i = 1; i <= raffleCount; i++) {
            if (raffles[i].status == RaffleStatus.ACTIVE &&
                block.timestamp >= raffles[i].endTime) {
                count++;
            }
        }
        ids = new uint256[](count);
        uint256 idx;
        for (uint256 i = 1; i <= raffleCount; i++) {
            if (raffles[i].status == RaffleStatus.ACTIVE &&
                block.timestamp >= raffles[i].endTime) {
                ids[idx++] = i;
            }
        }
    }

    /// @notice Full raffle state — read by CRE workflow before settlement decision
    /// @dev Returns all fields the workflow needs to decide what to do
    function getRaffleState(uint256 raffleId) external view returns (
        address      creator,
        uint8        token,         // 0 = USDC, 1 = WLD
        uint256      ticketsSold,
        uint256      ticketPrice,   // per ticket, in token's native decimals
        uint256      endTime,
        uint256      totalRevenue,  // ticketsSold × ticketPrice
        bool         isEnded,
        uint8        status         // 0=ACTIVE 1=SETTLED 2=EXPIRED
    ) {
        Raffle storage r = raffles[raffleId];
        uint256 tp = r.token == PaymentToken.USDC ? TICKET_PRICE_USDC : TICKET_PRICE_WLD;
        return (
            r.creator,
            uint8(r.token),
            r.ticketsSold,
            tp,
            r.endTime,
            r.ticketsSold * tp,
            block.timestamp >= r.endTime,
            uint8(r.status)
        );
    }

    /// @notice Get all ticket buyer addresses for a raffle
    /// @dev Useful for frontend display and emergency refund verification
    function getRaffleEntries(uint256 raffleId)
        external view returns (address[] memory)
    {
        return raffleEntries[raffleId];
    }

    /// @notice Get full raffle details including name and subname
    function getRaffleDetails(uint256 raffleId) external view returns (
        string       memory name,
        address             creator,
        PaymentToken        token,
        uint256             ticketsSold,
        uint256             endTime,
        RaffleStatus        status,
        bytes32             aiAttestationHash,
        string       memory winnerSubname
    ) {
        Raffle storage r = raffles[raffleId];
        return (
            r.name,
            r.creator,
            r.token,
            r.ticketsSold,
            r.endTime,
            r.status,
            r.aiAttestationHash,
            r.winnerSubname
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ERC165 — required by Chainlink CRE Forwarder
    // ─────────────────────────────────────────────────────────────────────────

    function supportsInterface(bytes4 interfaceId)
        external pure override returns (bool)
    {
        return
            interfaceId == type(IReceiver).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ADMIN
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Update platform wallet address
    /// @dev Use when wld5050.eth resolves to a new address
    function setPlatformWallet(address newWallet) external onlyOwner {
        platformWallet = newWallet;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  INTERNAL
    // ─────────────────────────────────────────────────────────────────────────

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
