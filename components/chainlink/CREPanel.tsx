import { CREStep } from '@/types'

interface Props { steps: CREStep[] }

const icons = { done: '✓', pending: '◌', error: '✗' }
const colors = { done: 'text-black', pending: 'text-gray-400', error: 'text-red-500' }

export default function CREPanel({ steps }: Props) {
  return (
    <div className="border border-gray-200 rounded-[10px] overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">Draw verification</span>
        <span className="text-[11px] text-gray-400">
          by <span className="font-mono text-black">agent.wld5050.eth</span>
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            <span className={`font-mono text-[13px] shrink-0 mt-0.5 ${colors[step.status]}`}>
              {icons[step.status]}
            </span>
            <div className="text-[12px] text-gray-600 leading-relaxed">
              <span className="text-black font-medium">{step.label}</span>
              {' · '}{step.detail}
              {step.mono && (
                <span className="font-mono text-[10px] text-gray-400 ml-1">{step.mono}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
