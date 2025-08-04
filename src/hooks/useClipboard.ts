import { useCallback, useState } from "react";

type CopyStatus = "idle" | "success" | "error";

export function useClipboard() {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [copyMessage, setCopyMessage] = useState("");

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      setCopyStatus("idle");
      setCopyMessage("");
      
      await navigator.clipboard.writeText(text);
      
      setCopyStatus("success");
      setCopyMessage("Code copied to clipboard!");
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setCopyStatus("idle");
        setCopyMessage("");
      }, 2000);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to copy to clipboard:", error);
      setCopyStatus("error");
      setCopyMessage("Failed to copy code");
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setCopyStatus("idle");
        setCopyMessage("");
      }, 3000);
    }
  }, []);

  return {
    copyStatus,
    copyMessage,
    copyToClipboard,
  };
}