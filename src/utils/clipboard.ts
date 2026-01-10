export async function copyTextToClipboard(text: string): Promise<void> {
  if (!text) {
    throw new Error("No text to copy");
  }

  const hasWindow = typeof window !== "undefined";
  const hasNavigator = typeof navigator !== "undefined";

  const canUseModernClipboard =
    hasWindow &&
    hasNavigator &&
    Boolean(window.isSecureContext) &&
    Boolean(navigator.clipboard?.writeText);

  if (canUseModernClipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to legacy method.
    }
  }

  // Legacy fallback works in more browsers and on insecure contexts (HTTP).
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";

  document.body.appendChild(textArea);

  try {
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    const success = document.execCommand("copy");
    if (!success) {
      throw new Error("Copy command was rejected");
    }
  } finally {
    document.body.removeChild(textArea);
  }
}
