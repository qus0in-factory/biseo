export function MarkdownRawView({ text }: { text: string }) {
  return (
    <pre className="overflow-x-auto border-l-[3px] border-l-primary bg-surface p-2 font-mono whitespace-pre-wrap break-words">
      {text}
    </pre>
  )
}
