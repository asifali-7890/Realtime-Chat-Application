// components/TypingIndicator.tsx
export default function TypingIndicator({ username }: { username: string }) {
    return (
        <div className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 italic">
            <span>{username} is typing</span>
            <div className="flex gap-0.5">
                <span className="animate-bounce [animation-delay:0ms]">.</span>
                <span className="animate-bounce [animation-delay:150ms]">.</span>
                <span className="animate-bounce [animation-delay:300ms]">.</span>
            </div>
        </div>
    );
}