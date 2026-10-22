export function TypingDots() {
  return (
    <span aria-hidden className="inline-flex gap-0.5">
      <span className="typing-dot size-1 rounded-full bg-current" />
      <span className="typing-dot size-1 rounded-full bg-current [animation-delay:150ms]" />
      <span className="typing-dot size-1 rounded-full bg-current [animation-delay:300ms]" />
    </span>
  );
}
