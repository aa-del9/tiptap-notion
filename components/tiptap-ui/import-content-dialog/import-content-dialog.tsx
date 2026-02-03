"use client";

import { useState, useContext, useCallback } from "react";
import { EditorContext } from "@tiptap/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/tiptap-ui-primitive/dialog";
import { Button } from "@/components/tiptap-ui-primitive/button";

import "@/components/tiptap-ui/import-content-dialog/import-content-dialog.scss";

type ContentType = "json" | "markdown";

export function ImportContentDialog() {
  const { editor } = useContext(EditorContext) || {};
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("markdown");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    if (!editor || !content.trim()) {
      setError("Please enter some content");
      return;
    }

    setError(null);

    try {
      if (contentType === "json") {
        // Parse and validate JSON
        const parsed = JSON.parse(content);
        editor.commands.setContent(parsed);
      } else {
        // For markdown, the tiptap-markdown extension automatically
        // intercepts setContent calls and parses markdown strings
        editor.commands.setContent(content);
      }

      // Focus the editor after setting content
      editor.commands.focus();

      // Reset and close
      setContent("");
      setOpen(false);
    } catch (err) {
      if (contentType === "json") {
        setError("Invalid JSON format. Please check your input.");
      } else {
        setError("Failed to parse content. Please check your input.");
      }
    }
  }, [editor, content, contentType]);

  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="import-content-trigger"
          tooltip="Import Content"
          aria-label="Import Content"
        >
          <ImportIcon />
          <span className="import-content-trigger-label">Import</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Content</DialogTitle>
          <DialogDescription>
            Paste your content below and choose the format to import it into the
            editor.
          </DialogDescription>
        </DialogHeader>

        <div className="import-content-form">
          <div className="import-content-type-selector">
            <button
              type="button"
              className={`import-content-type-option ${
                contentType === "markdown" ? "active" : ""
              }`}
              onClick={() => handleContentTypeChange("markdown")}
            >
              <MarkdownIcon />
              Markdown
            </button>
            <button
              type="button"
              className={`import-content-type-option ${
                contentType === "json" ? "active" : ""
              }`}
              onClick={() => handleContentTypeChange("json")}
            >
              <JsonIcon />
              JSON
            </button>
          </div>

          <textarea
            className="import-content-textarea"
            placeholder={
              contentType === "json"
                ? '{"type": "doc", "content": [...]}'
                : "# Heading\n\nYour markdown content here..."
            }
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            rows={12}
          />

          {error && <div className="import-content-error">{error}</div>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="import-content-cancel">Cancel</Button>
          </DialogClose>
          <Button
            className="import-content-submit"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function MarkdownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6h17.12c.79 0 1.44.63 1.44 1.41v9.18c0 .78-.65 1.41-1.44 1.41M6.81 15.19v-3.66l1.92 2.35 1.92-2.35v3.66h1.93V8.81h-1.93l-1.92 2.35-1.92-2.35H4.88v6.38h1.93M19.69 12h-1.92V8.81h-1.92V12h-1.93l2.89 3.28L19.69 12Z" />
    </svg>
  );
}

function JsonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path d="M8 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="M12 7v10" />
    </svg>
  );
}
