import type React from 'react'

export function MarkdownRawView({ text, toggle }: { text: string; toggle: React.ReactNode }) {
  return (
    <div className="mt-2">
      <div className="flex justify-end">{toggle}</div>
      <pre className="mt-2 overflow-x-auto border-l-[3px] border-l-primary bg-surface p-2 font-mono whitespace-pre-wrap break-words">
        {text}
      </pre>
    </div>
  )
}
