export class Annotator {
  static annotate(text: string, keywords: string[], style: string): string {
    if (!keywords || keywords.length === 0) return text;
    const kwSet = Array.from(new Set(keywords));

    switch (style) {
      case 'inline':
        return this.annotateInline(text, kwSet);
      case 'block':
        return this.annotateBlock(text, kwSet);
      case 'color':
        return this.annotateColor(text, kwSet);
      case 'side-by-side':
        return this.annotateSideBySide(text, kwSet);
      default:
        return this.annotateInline(text, kwSet);
    }
  }

  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private static annotateInline(text: string, keywords: string[]): string {
    const pattern = new RegExp(`\\b(${keywords.map(k => this.escapeRegExp(k)).join('|')})\\b`, 'g');
    return text.replace(pattern, (m) => `${m} /*:${m}:*/`);
  }

  private static annotateBlock(text: string, keywords: string[]): string {
    return text.split('\n').map(line => {
      const found = keywords.find(k => line.includes(k));
      if (found) {
        return `/* annotated: ${found} */\n${line}`;
      }
      return line;
    }).join('\n');
  }

  private static annotateColor(text: string, keywords: string[]): string {
    const pattern = new RegExp(`\\b(${keywords.map(k => this.escapeRegExp(k)).join('|')})\\b`, 'g');
    return text.replace(pattern, (m) => `\x1b[35m${m}\x1b[0m`);
  }

  private static annotateSideBySide(text: string, keywords: string[]): string {
    return text.split('\n').map(line => {
      let annotated = line;
      keywords.forEach(k => {
        const pattern = new RegExp(`\\b${this.escapeRegExp(k)}\\b`, 'g');
        annotated = annotated.replace(pattern, `${k}/*:${k}:*/`);
      });
      const left = line.trimEnd();
      const right = annotated.trimEnd();
      return `${left.padEnd(60)} | ${right}`;
    }).join('\n');
  }

  static generateTypeScriptScript(keywords: string[], style: string): string {
    return `
// Simple annotator script generated for user's keywords and style
const KEYWORDS = ${JSON.stringify(keywords)};
const STYLE = ${JSON.stringify(style)};

function escapeRegExp(string) {
  return string.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&');
}

function annotateInline(text) {
  const pattern = new RegExp(\`\\\\b(\${KEYWORDS.map(k => escapeRegExp(k)).join('|')})\\\\b\`, 'g');
  return text.replace(pattern, (m) => \`\${m} /*:\${m}:*/\`);
}

function annotateBlock(text) {
  return text.split('\\n').map(line => {
    const found = KEYWORDS.find(k => line.includes(k));
    if (found) {
      return \`/* annotated: \${found} */\\n\${line}\`;
    }
    return line;
  }).join('\\n');
}

function annotateColor(text) {
  const pattern = new RegExp(\`\\\\b(\${KEYWORDS.map(k => escapeRegExp(k)).join('|')})\\\\b\`, 'g');
  return text.replace(pattern, (m) => \`\\x1b[35m\${m}\\x1b[0m\`);
}

function annotateSideBySide(text) {
  return text.split('\\n').map(line => {
    let annotated = line;
    KEYWORDS.forEach(k => {
      const pattern = new RegExp(\`\\\\b\${escapeRegExp(k)}\\\\b\`, 'g');
      annotated = annotated.replace(pattern, \`\${k}/*:\${k}:*/\`);
    });
    const left = line.trimEnd();
    const right = annotated.trimEnd();
    return \`\${left.padEnd(60)} | \${right}\`;
  }).join('\\n');
}

function annotate(text) {
  switch (STYLE) {
    case 'inline': return annotateInline(text);
    case 'block': return annotateBlock(text);
    case 'color': return annotateColor(text);
    case 'side-by-side': return annotateSideBySide(text);
    default: return annotateInline(text);
  }
}

// Usage example:
// const input = require('fs').readFileSync(0, 'utf8');
// console.log(annotate(input));
`;
  }
}

