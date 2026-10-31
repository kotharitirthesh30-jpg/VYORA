import test from 'node:test';
import assert from 'node:assert/strict';
import { findRelevantMemories, formatMemoryContext } from './memory';
import { MemoryItem } from '../../types';

const mockMemories: MemoryItem[] = [
  {
    id: '1',
    content: 'User prefers concise TypeScript examples without classes.',
    category: 'Preferences',
    approved: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    content: 'Core backend uses PostgreSQL with Row Level Security.',
    category: 'Projects',
    approved: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    content: 'Unapproved experimental note about draft feature.',
    category: 'Custom',
    approved: false,
    createdAt: '',
    updatedAt: '',
  },
];

test('findRelevantMemories ignores unapproved memories', () => {
  const result = findRelevantMemories('experimental draft feature', mockMemories);
  assert.ok(!result.some((m) => m.id === '3'));
});

test('findRelevantMemories finds relevant approved memory by keywords', () => {
  const result = findRelevantMemories('How to write a typescript interface?', mockMemories);
  assert.ok(result.length > 0);
  assert.equal(result[0].id, '1');
});

test('formatMemoryContext outputs structured bulleted context with respectful notice', () => {
  const formatted = formatMemoryContext([mockMemories[0]]);
  assert.match(formatted, /User-Approved Knowledge & Context:/);
  assert.match(formatted, /\[Preferences\] User prefers concise TypeScript/);
  assert.match(formatted, /Honor these user preferences/);
});
