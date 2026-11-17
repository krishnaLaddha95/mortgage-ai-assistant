import { RagDocument } from './documents';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'what', 'how', 'do', 'does', 'my', 'i',
  'to', 'for', 'of', 'in', 'on', 'and', 'or', 'it', 'this', 'that', 'can',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word));
}

export function retrieveRelevantDocs(
  query: string,
  documents: RagDocument[] = [],
  topN = 2
): RagDocument[] {
  const queryWords = new Set(tokenize(query));
  if (queryWords.size === 0) return [];

  const scored = documents.map((doc) => {
    const docWords = tokenize(`${doc.title} ${doc.content}`);
    const score = docWords.filter((word) => queryWords.has(word)).length;
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((s) => s.doc);
}