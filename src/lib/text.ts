// Decode HTML entities in a string (curly quotes, dashes, etc.) coming from
// upstream feeds. Uses the browser's parser so we don't need a dependency.
export const decodeHtml = (input: string): string => {
  if (typeof window === "undefined") return input;
  const el = document.createElement("textarea");
  el.innerHTML = input;
  return el.value;
};
