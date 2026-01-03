import React, { useState } from "react";

type Props = {
  keywords: string[];
  setKeywords: (k: string[]) => void;
};

export default function KeywordUploader({ keywords, setKeywords }: Props) {
  const [text, setText] = useState("" );

  function onPasteSubmit() {
    const parsed = text
      .split(/\\r?\\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    setKeywords(Array.from(new Set([...keywords, ...parsed])));
    setText("");
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || "");
      const parsed = content
        .split(/\\r?\\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      setKeywords(Array.from(new Set([...keywords, ...parsed])));
    };
    reader.readAsText(f);
    e.currentTarget.value = "";
  }

  function removeKeyword(k: string) {
    setKeywords(keywords.filter((x) => x !== k));
  }

  return (
    <div className="keyword-uploader">
      <h2>Keywords</h2>
      <div className="controls">
        <textarea
          placeholder="Paste keywords (one per line)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="row">
          <button onClick={onPasteSubmit}>Add</button>
          <label className="file-input">
            Upload file
            <input type="file" accept=".txt" onChange={onFileChange} />
          </label>
        </div>
      </div>
      <ul className="keyword-list">
        {keywords.map((k) => (
          <li key={k}>
            <span className="chip">{k}</span>
            <button className="remove" onClick={() => removeKeyword(k)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

