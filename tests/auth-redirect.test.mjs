import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/lib/auth-redirect.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const exported = {};
vm.runInNewContext(`(function(exports){${compiled}\n})`, { URL, Set })(exported);
const { getSafeReturnPath, buildAuthHref } = exported;

test('login returns to allowed learning pages with grade, topic and section intact', () => {
  for (const path of ['/dashboard', '/tutor?grade=11&topic=oscillations', '/library?grade=10#personal', '/profile', '/settings', '/feedback', '/practice?grade=12']) {
    assert.equal(getSafeReturnPath(path), path);
  }
});

test('login return destinations reject external URLs, executable protocols and unrelated endpoints', () => {
  for (const path of [null, undefined, '', 'https://evil.example/tutor', '//evil.example/tutor', '/\\evil.example/tutor', '/%5Cevil.example', 'javascript:alert(1)', '/api/auth/sign-out', '/admin', '/login?next=/tutor', '/signup', '/tutor\n', '/tutor?x=%0A', '/tutor?x=%', '/unknown', '/tutor?' + 'x'.repeat(2048)]) {
    assert.equal(getSafeReturnPath(path), '/dashboard', String(path));
  }
});

test('switching between login and signup preserves one safely encoded return destination', () => {
  const destination = '/tutor?grade=11&topic=oscillations';
  for (const page of ['/login', '/signup']) {
    const authUrl = new URL(buildAuthHref(page, destination), 'https://g-physics.local');
    assert.equal(authUrl.pathname, page);
    assert.equal(authUrl.searchParams.get('next'), destination);
    assert.equal([...authUrl.searchParams].length, 1);
    assert.equal(new URL(buildAuthHref(page, '//evil.example'), authUrl).searchParams.get('next'), '/dashboard');
  }
});
