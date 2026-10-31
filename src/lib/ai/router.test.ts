import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyTask, routePrompt } from './router';

test('classifyTask detects coding questions correctly', () => {
  const result = classifyTask('How do I refactor this typescript function to handle async errors?');
  assert.equal(result, 'CODING');
});

test('classifyTask detects web research requests', () => {
  const result = classifyTask('Search the web for the latest quarterly GDP numbers today');
  assert.equal(result, 'WEB_RESEARCH');
});

test('classifyTask detects deep reasoning prompts', () => {
  const result = classifyTask('Derive the probability of obtaining two consecutive heads in 5 coin flips step by step');
  assert.equal(result, 'REASONING');
});

test('classifyTask detects document analysis when context has documents', () => {
  const result = classifyTask('What is the main revenue driver mentioned?', { hasDocuments: true });
  assert.equal(result, 'DOCUMENT_ANALYSIS');
});

test('routePrompt honors user manual model selection when autoRoute is false', () => {
  const decision = routePrompt('Write a python function', {
    manualModelId: 'vyora-deep-logic',
    autoRoute: false,
  });
  assert.equal(decision.selectedModelId, 'vyora-deep-logic');
  assert.match(decision.reason, /Using VYORA Deep Logic/);
});

test('routePrompt selects VYORA Research Nexus for web research with search tool', () => {
  const decision = routePrompt('Find the latest scientific papers published on quantum computing today', {
    autoRoute: true,
  });
  assert.equal(decision.category, 'WEB_RESEARCH');
  assert.equal(decision.selectedModelId, 'vyora-research-nexus');
  assert.ok(decision.toolsNeeded.includes('web_search'));
});
