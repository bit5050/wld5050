import { expect } from "chai"
import { ethers } from "hardhat"
import { namehash } from "viem/ens"

describe("WinnerEnsClaimRegistrar", () => {
  const parentNode = namehash("wld5050.eth")
  const resolver = "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"

  async function deploy() {
    const [signerWallet, winner, impostor] = await ethers.getSigners()

    const mockEns = await (await ethers.getContractFactory("MockENSRegistry")).deploy()

    const registrar = await (
      await ethers.getContractFactory("WinnerEnsClaimRegistrar")
    ).deploy(
      await mockEns.getAddress(),
      signerWallet.address,
      parentNode,
      resolver,
    )

    await mockEns.setApproved(await registrar.getAddress())
    return { registrar, mockEns, signerWallet, winner, impostor }
  }

  async function signClaim(
    signer: ethers.Signer,
    registrarAddress: string,
    raffleId: bigint,
    label: string,
    winner: string,
    deadline: bigint,
  ) {
    const domain = {
      name: "WLD5050 Winner ENS",
      version: "1",
      chainId: (await ethers.provider.getNetwork()).chainId,
      verifyingContract: registrarAddress,
    }

    const types = {
      Claim: [
        { name: "raffleId", type: "uint256" },
        { name: "label", type: "string" },
        { name: "winner", type: "address" },
        { name: "deadline", type: "uint256" },
      ],
    }

    return signer.signTypedData(domain, types, { raffleId, label, winner, deadline })
  }

  it("mints subname when signature is valid", async () => {
    const { registrar, mockEns, signerWallet, winner } = await deploy()

    const raffleId = 2n
    const label = "winner-round2"
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600)
    const signature = await signClaim(
      signerWallet,
      await registrar.getAddress(),
      raffleId,
      label,
      winner.address,
      deadline,
    )

    await registrar.connect(winner).claim(raffleId, label, deadline, signature)

    expect(await registrar.claimed(raffleId)).to.equal(true)
    expect(await mockEns.lastOwner()).to.equal(winner.address)
  })

  it("rejects duplicate claims", async () => {
    const { registrar, signerWallet, winner } = await deploy()

    const raffleId = 1n
    const label = "winner-round1"
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600)
    const signature = await signClaim(
      signerWallet,
      await registrar.getAddress(),
      raffleId,
      label,
      winner.address,
      deadline,
    )

    await registrar.connect(winner).claim(raffleId, label, deadline, signature)
    await expect(
      registrar.connect(winner).claim(raffleId, label, deadline, signature),
    ).to.be.revertedWithCustomError(registrar, "AlreadyClaimed")
  })

  it("rejects wrong winner address", async () => {
    const { registrar, signerWallet, winner, impostor } = await deploy()

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600)
    const signature = await signClaim(
      signerWallet,
      await registrar.getAddress(),
      3n,
      "winner-round3",
      winner.address,
      deadline,
    )

    await expect(
      registrar.connect(impostor).claim(3n, "winner-round3", deadline, signature),
    ).to.be.revertedWithCustomError(registrar, "InvalidSignature")
  })
})
