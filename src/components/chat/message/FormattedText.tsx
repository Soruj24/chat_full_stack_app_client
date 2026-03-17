"use client";

import React from "react";

interface FormattedTextProps {
  text: string;
  query?: string;
}

export function FormattedText({ text, query = "" }: FormattedTextProps) {
  let content: (string | React.ReactElement)[] = [text];

  // 1. Handle search highlighting
  if (query.trim()) {
    const newContent: (string | React.ReactElement)[] = [];
    const regex = new RegExp(`(${query})`, "gi");
    content.forEach((part) => {
      if (typeof part === "string") {
        const subParts = part.split(regex);
        subParts.forEach((subPart, i) => {
          if (subPart.toLowerCase() === query.toLowerCase()) {
            newContent.push(
              <span key={`highlight-${i}`} className="bg-yellow-300 dark:bg-yellow-500/50 text-black dark:text-white rounded-sm px-0.5 font-normal">
                {subPart}
              </span>
            );
          } else if (subPart) {
            newContent.push(subPart);
          }
        });
      } else {
        newContent.push(part);
      }
    });
    content = newContent;
  }

  // 2. Handle Markdown-like formatting (bold, italic, code)
  const formatPart = (part: string): (string | React.ReactElement)[] => {
    let parts: (string | React.ReactElement)[] = [part];

    // Bold: *text*
    let nextParts: (string | React.ReactElement)[] = [];
    parts.forEach(p => {
      if (typeof p === 'string') {
        const sub = p.split(/(\*[^*]+\*)/g);
        sub.forEach((s, i) => {
          if (s.startsWith('*') && s.endsWith('*')) {
            nextParts.push(<strong key={`bold-${i}`} className="font-bold">{s.slice(1, -1)}</strong>);
          } else if (s) {
            nextParts.push(s);
          }
        });
      } else {
        nextParts.push(p);
      }
    });
    parts = nextParts;

    // Italic: _text_
    nextParts = [];
    parts.forEach(p => {
      if (typeof p === 'string') {
        const sub = p.split(/(_[^_]+_)/g);
        sub.forEach((s, i) => {
          if (s.startsWith('_') && s.endsWith('_')) {
            nextParts.push(<em key={`italic-${i}`} className="italic">{s.slice(1, -1)}</em>);
          } else if (s) {
            nextParts.push(s);
          }
        });
      } else {
        nextParts.push(p);
      }
    });
    parts = nextParts;

    // Code: `text`
    nextParts = [];
    parts.forEach(p => {
      if (typeof p === 'string') {
        const sub = p.split(/(`[^`]+`)/g);
        sub.forEach((s, i) => {
          if (s.startsWith('`') && s.endsWith('`')) {
            nextParts.push(
              <code key={`code-${i}`} className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono text-[0.9em]">
                {s.slice(1, -1)}
              </code>
            );
          } else if (s) {
            nextParts.push(s);
          }
        });
      } else {
        nextParts.push(p);
      }
    });
    parts = nextParts;

    return parts;
  };

  const finalContent: (string | React.ReactElement)[] = [];
  content.forEach(part => {
    if (typeof part === 'string') {
      finalContent.push(...formatPart(part));
    } else {
      finalContent.push(part);
    }
  });

  return (
    <span className="text-[15px] leading-relaxed tracking-tight break-words whitespace-pre-wrap font-sans px-3 py-1.5">
      {finalContent}
    </span>
  );
}
