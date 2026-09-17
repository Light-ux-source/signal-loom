import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const providers = await readFile(new URL('../src/lib/providers.ts', import.meta.url), 'utf8');
const route = await readFile(new URL('../src/app/api/scan/route.ts', import.meta.url), 'utf8');
const envExample = await readFile(new URL('../.env.example', import.meta.url), 'utf8');

test('TwitterAPI.io uses the documented endpoint and header', () => {
  assert.match(providers, /api\.twitterapi\.io\/twitter\/tweet\/advanced_search/);
  assert.match(providers, /['"]X-API-Key['"]/);
  assert.match(providers, /lang:zh/);
});

test('OpenRouter prompt requires Chinese structured output', () => {
  assert.match(providers, /简体中文/);
  assert.match(providers, /signals/);
  assert.match(providers, /confidence/);
});

test('scan route validates bad input and reports upstream errors', () => {
  assert.match(route, /status: 400/);
  assert.match(route, /status: 502/);
});

test('example environment never contains a real secret', () => {
  assert.doesNotMatch(envExample, /sk-or-v1-|new1_/);
});