export interface TextChunk {
  chunkIndex: number;
  content: string;
  tokenCount: number;
  embedding?: number[];
}

export function chunkText(text: string, maxChunkTokens: number = 250, overlapTokens: number = 40): TextChunk[] {
  if (!text || text.trim().length === 0) return [];

  // Rough estimation: 1 word ~ 1.3 tokens
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const chunks: TextChunk[] = [];
  
  const wordsPerChunk = Math.max(20, Math.floor(maxChunkTokens / 1.3));
  const wordsOverlap = Math.max(5, Math.floor(overlapTokens / 1.3));

  let start = 0;
  let chunkIndex = 0;

  while (start < words.length) {
    const end = Math.min(start + wordsPerChunk, words.length);
    const chunkWords = words.slice(start, end);
    const content = chunkWords.join(' ');
    
    chunks.push({
      chunkIndex,
      content,
      tokenCount: Math.ceil(chunkWords.length * 1.3),
    });

    chunkIndex++;
    if (end >= words.length) break;
    start += wordsPerChunk - wordsOverlap;
  }

  return chunks;
}

export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Deterministic semantic term frequency vectorizer for fast offline retrieval and fallback
export function getKeywordFrequencyVector(text: string, vocabulary: string[]): number[] {
  const words = text.toLowerCase().match(/\b[a-z0-9_-]+\b/g) || [];
  const counts: Record<string, number> = {};
  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
  }

  return vocabulary.map((term) => counts[term] || 0);
}

export function retrieveTopChunks(
  query: string,
  chunks: TextChunk[],
  topK: number = 3
): { chunk: TextChunk; score: number }[] {
  if (chunks.length === 0) return [];

  // Extract query keywords
  const queryTerms = Array.from(new Set(query.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || []));
  if (queryTerms.length === 0) {
    return chunks.slice(0, topK).map((chunk) => ({ chunk, score: 0.1 }));
  }

  // Score each chunk by term presence and BM25-like density
  const scored = chunks.map((chunk) => {
    const chunkLower = chunk.content.toLowerCase();
    let matchCount = 0;
    let exactPhraseBonus = 0;

    if (chunkLower.includes(query.toLowerCase().trim())) {
      exactPhraseBonus = 3.0;
    }

    for (const term of queryTerms) {
      if (chunkLower.includes(term)) {
        matchCount++;
      }
    }

    const termCoverage = matchCount / queryTerms.length;
    const score = termCoverage * 2.0 + exactPhraseBonus;

    return { chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
