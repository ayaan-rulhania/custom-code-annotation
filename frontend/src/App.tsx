import React, { useState } from "react";
import KeywordUploader from "./components/KeywordUploader";
import StyleSelector from "./components/StyleSelector";
import AnnotatorForm from "./components/AnnotatorForm";
import ScriptGenerator from "./components/ScriptGenerator";

export default function App() {
  const [keywords, setKeywords] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("custom_keywords");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [style, setStyle] = useState<string>(() => {
    return localStorage.getItem("annotation_style") || "inline";
  });

  React.useEffect(() => {
    localStorage.setItem("custom_keywords", JSON.stringify(keywords));
  }, [keywords]);

  React.useEffect(() => {
    localStorage.setItem("annotation_style", style);
  }, [style]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Custom Language Annotator</h1>
      </header>
      <main className="container">
        <section className="panel">
          <StyleSelector value={style} onChange={setStyle} />
          <KeywordUploader keywords={keywords} setKeywords={setKeywords} />
        </section>
        <section className="panel">
          <AnnotatorForm keywords={keywords} style={style} />
          <ScriptGenerator keywords={keywords} style={style} />
        </section>
      </main>
    </div>
  );
}
