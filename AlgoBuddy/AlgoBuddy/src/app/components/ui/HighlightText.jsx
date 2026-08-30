"use client";

export default function HighlightText({ text, query, className = "" }) {
  if (!query.trim() || !text) {
    return <span className={className}>{text || ""}</span>;
  }

  const str = String(text);
  const lower = str.toLowerCase();
  const lowerQuery = query.toLowerCase();

  if (!lower.includes(lowerQuery)) {
    return <span className={className}>{str}</span>;
  }

  const parts = [];
  let lastIndex = 0;

  let matchIndex = lower.indexOf(lowerQuery, lastIndex);
  while (matchIndex !== -1) {
    if (matchIndex > lastIndex) {
      parts.push(str.slice(lastIndex, matchIndex));
    }
    parts.push(
      <mark
        key={matchIndex}
        className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5 not-italic font-semibold"
      >
        {str.slice(matchIndex, matchIndex + query.length)}
      </mark>
    );
    lastIndex = matchIndex + query.length;
    matchIndex = lower.indexOf(lowerQuery, lastIndex);
  }

  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
