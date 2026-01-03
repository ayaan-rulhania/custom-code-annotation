import express from 'express';
import cors from 'cors';
import { Annotator } from './annotator';

const app = express();
const port = 4567;

app.use(cors());
app.use(express.json());

app.post('/api/annotate', (req, res) => {
  const { file, keywords, style } = req.body;
  const annotated = Annotator.annotate(file || '', keywords || [], style || 'inline');
  res.json({ annotated });
});

app.post('/api/generate_script', (req, res) => {
  const { keywords, style, language } = req.body;
  
  // Since the user asked for TypeScript/React backend, I'll generate a TS script too
  const script = Annotator.generateTypeScriptScript(keywords || [], style || 'inline');
  
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename=annotator.ts');
  res.send(script);
});

app.listen(port, () => {
  console.log(`TypeScript backend listening at http://localhost:${port}`);
});

