export function MermaidFallback({ source }: { source: string }) {
  return (
    <pre className="mt-2 overflow-x-auto border-l-[3px] border-l-primary bg-surface p-2 font-mono whitespace-pre-wrap break-words">
      <code>{source}</code>
    </pre>
  )
}
