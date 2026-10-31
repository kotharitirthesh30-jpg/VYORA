import { MemoryItem } from '../../types';

export function findRelevantMemories(prompt: string, memories: MemoryItem[], maxItems: number = 3): MemoryItem[] {
  const approvedMemories = memories.filter((m) => m.approved);
  if (approvedMemories.length === 0) return [];

  const promptWords = new Set(prompt.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || []);
  if (promptWords.size === 0) return approvedMemories.slice(0, maxItems);

  const scored = approvedMemories.map((mem) => {
    const memWords = mem.content.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
    let matches = 0;
    for (const w of memWords) {
      if (promptWords.has(w)) {
        matches++;
      }
    }
    // Boost communication and preferences
    const categoryBonus = mem.category === 'Preferences' || mem.category === 'Communication' ? 0.5 : 0;
    const score = matches + categoryBonus;
    return { mem, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map((s) => s.mem);
}

export function formatMemoryContext(memories: MemoryItem[]): string {
  if (memories.length === 0) return '';

  const lines = memories.map((m) => `- [${m.category}] ${m.content}`);
  return `\nUser-Approved Knowledge & Context:\n${lines.join('\n')}\n(Note: Honor these user preferences while respecting their current explicit prompt instructions).\n`;
}
