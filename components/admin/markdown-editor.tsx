"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bold, Italic, Heading2, List, Link2, Quote, Eye, Pencil } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ToolbarAction {
  icon: typeof Bold;
  label: string;
  wrap: (selected: string) => string;
}

const actions: ToolbarAction[] = [
  { icon: Bold, label: "Bold", wrap: (s) => `**${s || "bold text"}**` },
  { icon: Italic, label: "Italic", wrap: (s) => `*${s || "italic text"}*` },
  { icon: Heading2, label: "Heading", wrap: (s) => `\n## ${s || "Heading"}\n` },
  { icon: List, label: "List", wrap: (s) => `\n- ${s || "List item"}\n` },
  { icon: Link2, label: "Link", wrap: (s) => `[${s || "link text"}](https://)` },
  { icon: Quote, label: "Quote", wrap: (s) => `\n> ${s || "Quoted text"}\n` },
];

/**
 * Plain-text Markdown editor with a formatting toolbar that inserts
 * syntax around the current selection, plus a Preview tab. Chosen over a
 * full WYSIWYG library to avoid an unnecessary heavy dependency — the
 * toolbar buttons mean a non-technical clinic owner never has to
 * remember Markdown syntax by hand.
 */
export function MarkdownEditor({
  value,
  onChange,
  minRows = 16,
}: {
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
}) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyAction(action: ToolbarAction) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const replacement = action.wrap(selected);
    const nextValue = value.slice(0, selectionStart) + replacement + value.slice(selectionEnd);
    onChange(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selectionStart + replacement.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className="overflow-hidden rounded border border-ink-200">
      <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          {actions.map(({ icon: Icon, label, ...action }) => (
            <button
              key={label}
              type="button"
              title={label}
              onClick={() => applyAction({ icon: Icon, label, ...action })}
              className="flex h-8 w-8 items-center justify-center rounded text-ink-500 hover:bg-ink-100 hover:text-ink"
            >
              <Icon className="h-4 w-4" aria-hidden />
            </button>
          ))}
        </div>
        <div className="flex overflow-hidden rounded border border-ink-200 bg-white text-xs">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 font-medium",
              mode === "write" ? "bg-ink text-white" : "text-ink-500"
            )}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden /> Write
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 font-medium",
              mode === "preview" ? "bg-ink text-white" : "text-ink-500"
            )}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden /> Preview
          </button>
        </div>
      </div>

      {mode === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={minRows}
          placeholder="Write your post using Markdown — use the toolbar above for formatting help."
          className="w-full resize-y border-none px-4 py-3 text-[15px] leading-relaxed text-ink focus:outline-none"
        />
      ) : (
        <div className="prose prose-neutral max-w-none px-4 py-3" style={{ minHeight: `${minRows * 1.6}rem` }}>
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-ink-300">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
