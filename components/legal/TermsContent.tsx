import Link from 'next/link'

type Section = {
  title: string
  subsections: {
    heading?: string
    paragraphs?: string[]
    list?: string[]
  }[]
}

const sections: Section[] = [
  {
    title: 'Terms of Use',
    subsections: [
      {
        heading: 'Acceptance of Terms',
        paragraphs: [
          'By accessing or using WLD5050 (wld5050.com), a decentralized application ("Web App") operated by BIT5050 INC. ("the Company"), you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, do not use the Web App.',
        ],
      },
      {
        heading: 'Eligibility',
        paragraphs: [
          'You must be at least 18 years old or the legal age of majority in your jurisdiction to use the Web App. By using the Web App, you represent and warrant that you meet this requirement.',
        ],
      },
      {
        heading: 'Web3 and Blockchain Integration',
        paragraphs: [
          'WLD5050 operates on World Chain and integrates World ID for proof-of-humanity verification, Chainlink CRE for automated settlement, and ENS for identity display. By using the Web App, you acknowledge and accept the inherent risks associated with blockchain technologies, including but not limited to smart contract vulnerabilities, token value fluctuations, and transaction failures.',
        ],
      },
      {
        heading: 'Prohibited Activities',
        list: [
          'Use the Web App for any illegal or unauthorized purpose.',
          'Interfere with or disrupt the operation of the Web App.',
          'Engage in activities that could harm the reputation or integrity of the Company or its affiliates.',
          'Attempt to circumvent World ID verification or one-ticket-per-human restrictions.',
        ],
      },
      {
        heading: 'Intellectual Property',
        paragraphs: [
          'All content on the Web App, including but not limited to text, graphics, logos, and software, is the property of the Company or its licensors and is protected by intellectual property laws. You may not copy, reproduce, or distribute any content without prior written consent from the Company.',
        ],
      },
      {
        heading: 'Termination',
        paragraphs: [
          'The Company reserves the right to suspend or terminate your access to the Web App at its discretion, without notice, for any reason, including but not limited to violations of these Terms of Use.',
        ],
      },
    ],
  },
  {
    title: 'Privacy Policy',
    subsections: [
      {
        heading: 'Data Collection',
        paragraphs: [
          'The Web App collects limited data required to provide its services, and is transparent with all 50/50 raffle data via block explorers, such as:',
        ],
        list: [
          'Wallet addresses for blockchain transactions.',
          'World ID verification signals required for raffle entry (zero-knowledge proofs; no personal identity data stored by WLD5050).',
          'Contact information you voluntarily provide.',
          'Technical data, such as device type and IP address.',
        ],
      },
      {
        paragraphs: [
          'The Web App does not collect or store sensitive personal information unless explicitly provided by the user.',
        ],
      },
      {
        heading: 'Use of Data',
        paragraphs: ['Collected data is used solely to:'],
        list: [
          'Facilitate transactions and Web3 integrations.',
          'Improve the functionality and security of the Web App.',
          'Communicate important updates and information to users.',
        ],
      },
      {
        heading: 'Data Sharing',
        paragraphs: [
          'The Company does not sell or share your personal data with third parties, except as required by law or to fulfill the services of the Web App.',
        ],
      },
      {
        heading: 'Blockchain Data',
        paragraphs: [
          'Please note that transactions and interactions on blockchain networks are public and immutable. The Company is not responsible for any data you make available on such networks.',
        ],
      },
      {
        heading: 'Security',
        paragraphs: [
          'The Company implements reasonable security measures to protect your data. However, no system is entirely secure, and the Company cannot guarantee the absolute security of your information.',
        ],
      },
    ],
  },
  {
    title: 'Liability Waiver',
    subsections: [
      {
        heading: 'No Guarantees',
        paragraphs: [
          'The Web App is provided on an "as-is" and "as-available" basis. The Company makes no guarantees or warranties regarding the functionality, reliability, or availability of the Web App.',
        ],
      },
      {
        heading: 'Limitation of Liability',
        paragraphs: [
          'To the fullest extent permitted by law, the Company, its affiliates, members, officers, directors, employees, and agents shall not be liable for any:',
        ],
        list: [
          'Direct, indirect, incidental, or consequential damages arising from the use of the Web App.',
          'Losses due to technical issues, cyberattacks, network congestion issues, network delays, wallet bugs, wallet issues, or blockchain-related risks.',
          'Winning or losing of raffles on the Web App. Financial losses related to token or cryptocurrency transactions.',
        ],
      },
      {
        heading: 'Indemnification',
        paragraphs: [
          'By using the Web App, you agree to indemnify and hold harmless the Company and its affiliates from any claims, damages, or expenses arising out of your use of the Web App or violation of these terms.',
        ],
      },
      {
        heading: 'Acknowledgment of Risk',
        paragraphs: [
          'You acknowledge that blockchain and Web3 technologies are experimental and carry significant risks. You assume full responsibility for your use of the Web App and any associated losses.',
        ],
      },
    ],
  },
  {
    title: 'User Agreement',
    subsections: [
      {
        heading: 'Binding Agreement',
        paragraphs: [
          'By using the Web App, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use, User Agreement, Privacy Policy, and Liability Waiver. These terms constitute a legally binding agreement between you and BIT5050 INC.',
          'By clicking "I Agree" and/or using the Web App, you acknowledge that you understand and accept that the Company, BIT5050 INC., and any of its members, officers, directors, affiliates, or agents are not liable for any losses (including but not limited to financial, operational, reputational, or other damages) arising out of or in connection with the use of this Web App or any related products, services, or information.',
          'You further agree to indemnify and hold harmless BIT5050 INC. and all associated parties from any liability, claims, or damages resulting from your use of or reliance on our services.',
        ],
      },
      {
        paragraphs: ['By using the platform, you acknowledge and agree to the following:'],
        list: [
          'You are at least 18 years old',
          'You understand that participating in raffles involves risk (winning and losing)',
          'You are responsible for any taxes on winnings',
          'You understand that all transactions are final, transparent, public, and non-refundable',
          'You understand BIT5050 INC. is not responsible for any losses, lost crypto funds, network issues, network congestion, network delays, wallet issues, wallet bugs, or blockchain-related errors',
          'This is a first release (beta version) of our product; there could be errors, bugs, or smart contract vulnerabilities',
          'BIT5050 INC. will not be held liable for any losses of any kind and you agree to use the product at your own risk',
        ],
      },
    ],
  },
  {
    title: 'Blockchain-as-a-Service (BaaS) Disclaimer',
    subsections: [
      {
        paragraphs: [
          'By accessing, using, or interacting with WLD5050 or any decentralized applications, platforms, or services provided by BIT5050 INC., you acknowledge and agree to the following:',
        ],
      },
      {
        heading: 'No Financial Advice',
        paragraphs: [
          'BIT5050 INC. does not provide financial, investment, tax, or legal advice. All information and services are for informational and operational purposes only. Participation in our platforms, including Web3-based raffles, does not constitute financial advice.',
        ],
      },
      {
        heading: 'Not a Token or Investment Product',
        paragraphs: [
          'BIT5050 INC. is a Blockchain-as-a-Service (BaaS) company. We do not issue or promote any tokens. Our platform is utility-based, offering decentralized raffle infrastructure only. WLD5050 follows our founding philosophy: All Product. All Service. No Token.',
        ],
      },
      {
        heading: 'Assumption of Risk',
        paragraphs: [
          'By using our dApps, you acknowledge the inherent risks of blockchain, including smart contract failures, loss of funds, market volatility, and third-party interference.',
        ],
      },
      {
        heading: 'Limitation of Liability',
        paragraphs: [
          'To the maximum extent permitted by law, BIT5050 INC. and its team shall not be liable for any damages including lost profits, data, or other intangible losses resulting from:',
        ],
        list: [
          'Use or inability to use our services',
          'Third-party content or conduct on our platform',
          'Unauthorized access or modification of your data',
          'Blockchain or smart contract errors',
        ],
      },
      {
        heading: 'No Guarantees',
        paragraphs: [
          'We do not guarantee any outcome. All raffles are governed by smart contracts and are subject to blockchain risks.',
        ],
      },
      {
        heading: 'Indemnification',
        paragraphs: [
          'You agree to indemnify and hold harmless BIT5050 INC. and all related parties from any claims arising from your use of the platform.',
        ],
      },
      {
        heading: 'Binding Agreement',
        paragraphs: [
          'By using our services, you agree to this disclaimer and waive your right to bring legal action against BIT5050 INC. related to your use of its products or services.',
        ],
      },
    ],
  },
]

export default function TermsContent() {
  return (
    <article className="space-y-10">
      <header className="space-y-4 border-b border-[0.5px] border-[#E0E0E0] pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9E9E9E]">Legal</p>
        <h1 className="font-display text-[32px] font-semibold tracking-tight text-black sm:text-[36px]">
          Terms of Use &amp; Privacy Policy
        </h1>
        <p className="font-body text-[14px] leading-relaxed text-[#616161] max-w-[640px]">
          WLD5050 by BIT5050 INC. — Human-verified 50/50 raffles on World Chain. Effective Date:
          July 11, 2025.
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="space-y-5">
          <h2 className="font-display text-[22px] font-semibold tracking-tight text-black">
            {section.title}
          </h2>
          {section.subsections.map((sub, index) => (
            <div key={`${section.title}-${index}`} className="space-y-3">
              {sub.heading ? (
                <h3 className="font-display text-[16px] font-semibold tracking-tight text-black">
                  {sub.heading}
                </h3>
              ) : null}
              {sub.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="font-body text-[14px] leading-relaxed text-[#616161]"
                >
                  {paragraph}
                </p>
              ))}
              {sub.list ? (
                <ul className="list-disc space-y-2 pl-5 font-body text-[14px] leading-relaxed text-[#616161]">
                  {sub.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </section>
      ))}

      <footer className="border-t border-[0.5px] border-[#E0E0E0] pt-8 space-y-2">
        <h2 className="font-display text-[18px] font-semibold tracking-tight text-black">
          Contact Information
        </h2>
        <p className="font-body text-[14px] leading-relaxed text-[#616161]">
          If you have any questions or concerns about these policies, please contact us at{' '}
          <a
            href="mailto:info@bit5050.com"
            className="font-medium text-black underline underline-offset-2 hover:opacity-70"
          >
            info@bit5050.com
          </a>
          .
        </p>
        <p className="font-body text-[13px] text-[#9E9E9E]">
          Also see{' '}
          <Link href="/about" className="text-black underline underline-offset-2 hover:opacity-70">
            About WLD5050
          </Link>
          .
        </p>
      </footer>
    </article>
  )
}
