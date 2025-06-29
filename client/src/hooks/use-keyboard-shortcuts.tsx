import { useEffect } from "react";
import { useLocation } from "wouter";

export function useKeyboardShortcuts() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "1":
            event.preventDefault();
            setLocation("/");
            break;
          case "2":
            event.preventDefault();
            setLocation("/graph");
            break;
          case "/":
            event.preventDefault();
            // Focus on message input if available
            const messageInput = document.querySelector(
              'textarea[placeholder*="Ask the AI"]'
            ) as HTMLTextAreaElement;
            if (messageInput) {
              messageInput.focus();
            }
            break;
        }
      }

      // Escape key shortcuts
      if (event.key === "Escape") {
        // Close any open modals or panels
        const escapeEvent = new CustomEvent("escape-pressed");
        document.dispatchEvent(escapeEvent);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setLocation]);
}

export default useKeyboardShortcuts;
