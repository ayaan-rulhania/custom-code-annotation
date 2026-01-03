import React, { useState } from "react";
import { generateScript } from "../api/client";

type Props = {
  keywords: string[];
  style: string;
};

export default function ScriptGenerator({ keywords, style }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function onDownload() {
    setDownloading(true);
      try {
      const blob = await generateScript(keywords, style, "typescript");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "annotator.ts";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate script");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="script-generator">
      <h2>Generate Script</h2>
      <p>Download a TypeScript script that annotates files using your keywords and selected style.</p>
      <div className="row">
        <button onClick={onDownload} disabled={downloading || keywords.length === 0}>
          {downloading ? "Generating…" : "Download TypeScript Script"}
        </button>
      </div>
    </div>
  );
}

