import { useCopyToClipboard } from '@uidotdev/usehooks';
import { useEffect, useRef, useState } from 'react';
import { FaCheck as CheckmarkIcon } from 'react-icons/fa6';
import { LuCopy as CopyIcon } from 'react-icons/lu';

export function CopyButton({
  buttonStyle,
  disabled,
  text,
}: {
  buttonStyle: string;
  disabled: boolean;
  text: string;
}) {
  const [clickCount, setClickCount] = useState<number>(0);
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [hasCopiedText, setHasCopiedText] = useState<boolean>(false);

  const delayMs = 800 as const;
  const timeoutHandler = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!copiedText) return;
    setHasCopiedText(true);
  }, [copiedText, clickCount]);

  useEffect(() => {
    if (!hasCopiedText) return;

    timeoutHandler.current = setTimeout(() => {
      setHasCopiedText(false);
    }, delayMs);

    return () => {
      if (timeoutHandler.current) {
        clearTimeout(timeoutHandler.current);
      }
    };
  }, [hasCopiedText]);

  return (
    <button
      className={`${hasCopiedText ? 'btn-success' : 'btn-info'} ${buttonStyle}`}
      disabled={disabled}
      onClick={() => {
        copyToClipboard(text);
        setClickCount((current) => current + 1);
      }}
    >
      <span
        className={`flex items-center gap-inherit ${hasCopiedText ? 'invisible' : ''}`.trimEnd()}
      >
        <CopyIcon />
        Copy
      </span>
      {hasCopiedText ? <CheckmarkIcon className="absolute" /> : null}
    </button>
  );
}
