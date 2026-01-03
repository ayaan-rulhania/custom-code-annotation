export async function annotateFile(file: string, keywords: string[], style: string) {
  const resp = await fetch("/api/annotate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file, keywords, style })
  });
  if (!resp.ok) throw new Error("Annotate request failed");
  return await resp.json();
}

export async function generateScript(keywords: string[], style: string, language = "typescript") {
  const resp = await fetch("/api/generate_script", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keywords, style, language })
  });
  if (!resp.ok) throw new Error("Generate script failed");
  const blob = await resp.blob();
  return blob;
}

