import React, { useState } from "react";
import { annotateFile } from "../api/client";

type Props = {
  keywords: string[];
  style: string;
};

export default function AnnotatorForm({ keywords, style }: Props) {
  const [fileText, setFileText] = useState("" );
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function renderAnnotated(text: string) {
    // Basic ANSI to HTML conversion for magenta [35m
    const parts = text.split(/(\x1b\[35m.*?\x1b\[0m)/g);
    return parts.map((part, i) => {
      if (part.startsWith('\x1b[35m')) {
        const content = part.replace('\x1b[35m', '').replace('\x1b[0m', '');
        return <span key={i} className="hl-magenta">{content}</span>;
      }
      return part;
    });
  }

  async function onAnnotate() {
    setLoading(true);
    try {
      const resp = await annotateFile(fileText, keywords, style);
      setResult(resp.annotated);
    } catch (err) {
      setResult("Error annotating file");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="annotator-form">
      <h2>Annotate File</h2>
      <textarea
        placeholder="Paste source file here..."
        value={fileText}
        onChange={(e) => setFileText(e.target.value)}
      />
      <div className="row">
        <button onClick={onAnnotate} disabled={loading || !fileText}>
          {loading ? "Annotating…" : "Annotate"}
        </button>
      </div>
      {result ? (
        <div className="result">
          <h3>Annotated Output</h3>
          <pre>{renderAnnotated(result)}</pre>
        </div>
      ) : null}
    </div>
  );
}

