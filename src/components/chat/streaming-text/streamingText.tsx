interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
}

function StreamingText({ text, isStreaming }: StreamingTextProps) {
  return (
    <span className="whitespace-pre-wrap">
      {text}
      {isStreaming && (
        <span
          className="inline-block w-1.5 h-4 bg-brand-600 ml-0.5 animate-pulse align-middle"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export default StreamingText;
