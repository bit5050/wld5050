const steps = [
  {
    title: 'Verify with World ID',
    body: 'Every creator and ticket buyer proves they are a unique human — one ticket per person.',
  },
  {
    title: 'Create or enter a raffle',
    body: 'Creators pay a flat fee and set the duration. Buyers purchase $2.50 USDC tickets until the raffle ends.',
  },
  {
    title: 'Chainlink CRE settles automatically',
    body: 'When the deadline passes, CRE selects a random winner, splits the pot 50/50, and pays both parties — no claiming step.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="px-6 py-10 max-w-[560px]">
      <h1 className="font-display text-[28px] font-semibold tracking-tight mb-1">How It Works</h1>
      <p className="text-[13px] text-gray-600 mb-8">
        Human-verified 50/50 raffles on World Chain — fair, automated, and transparent.
      </p>
      <ol className="space-y-6">
        {steps.map((step, i) => (
          <li key={step.title} className="border border-gray-200 rounded-[10px] p-5">
            <p className="font-mono text-[11px] text-gray-400 uppercase tracking-widest mb-2">
              Step {i + 1}
            </p>
            <h2 className="font-display text-[16px] font-semibold mb-2">{step.title}</h2>
            <p className="text-[13px] text-gray-600 leading-relaxed">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
