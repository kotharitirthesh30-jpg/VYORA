import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkText, computeCosineSimilarity, retrieveTopChunks } from './rag';

test('chunkText splits long text into sequential chunks', () => {
  const sample = 'Word '.repeat(500);
  const chunks = chunkText(sample, 100, 20);
  assert.ok(chunks.length > 2);
  assert.equal(chunks[0].chunkIndex, 0);
  assert.equal(chunks[1].chunkIndex, 1);
  assert.ok(chunks[0].tokenCount > 0);
});

test('computeCosineSimilarity returns 1 for identical vectors and 0 for orthogonal', () => {
  const v1 = [1, 0, 0];
  const v2 = [1, 0, 0];
  const v3 = [0, 1, 0];

  assert.equal(Math.round(computeCosineSimilarity(v1, v2)), 1);
  assert.equal(computeCosineSimilarity(v1, v3), 0);
});

test('retrieveTopChunks prioritizes chunks containing query keywords', () => {
  const chunks = [
    { chunkIndex: 0, content: 'Apples and bananas are sweet fruits for breakfast.', tokenCount: 10 },
    { chunkIndex: 1, content: 'Quantum computing leverages qubits and entanglement principles.', tokenCount: 12 },
    { chunkIndex: 2, content: 'The revenue grew by forty percent due to subscription expansion.', tokenCount: 12 },
  ];

  const results = retrieveTopChunks('quantum qubits entanglement', chunks, 1);
  assert.equal(results.length, 1);
  assert.equal(results[0].chunk.chunkIndex, 1);
  assert.ok(results[0].score > 1.0);
});
