import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const validatorPath = path.join(repoRoot, 'scripts', 'validate-themes.mjs');

function webpBytes(size = 32) {
  const buffer = Buffer.alloc(size, 0);
  buffer.write('RIFF', 0, 'ascii');
  buffer.write('WEBP', 8, 'ascii');
  return buffer;
}

async function createRoot() {
  const root = await mkdtemp(path.join(tmpdir(), 'vrcx-theme-validator-'));
  await mkdir(path.join(root, 'themes'), { recursive: true });
  return root;
}

async function writeTheme(root, id, manifest = {}) {
  const dir = path.join(root, 'themes', id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'theme.css'), ':root { color-scheme: dark; }\n');
  await writeFile(path.join(dir, 'preview.webp'), webpBytes());
  await writeFile(
    path.join(dir, 'theme.json'),
    `${JSON.stringify(
      {
        id,
        name: id,
        version: '1.0.0',
        author: { name: 'Author', github: 'author-name' },
        description: 'Test theme.',
        tags: ['dark'],
        testedWith: '2.2.1',
        remoteAssets: false,
        darkMode: true,
        accentMode: false,
        ...manifest
      },
      null,
      2
    )}\n`
  );
}

async function writeReadme(root, themeIds) {
  const themeList = themeIds.map((id) => `- [${id}](themes/${id}/) by Author`).join('\n');
  await writeFile(
    path.join(root, 'README.md'),
    `# VRCX-0 Community Themes\n\n## Maintained Themes\n\n${themeList}\n`
  );
}

function runValidator(root) {
  return new Promise((resolve) => {
    execFile(process.execPath, [validatorPath, '--root', root], { cwd: repoRoot }, (error, stdout, stderr) => {
      resolve({
        code: error?.code ?? 0,
        output: `${stdout}${stderr}`
      });
    });
  });
}

test('accepts a valid catalog and theme package', async () => {
  const root = await createRoot();
  await writeTheme(root, 'valid-theme');
  await writeReadme(root, ['valid-theme']);
  await writeFile(
    path.join(root, 'themes', 'index.json'),
    `${JSON.stringify({ schemaVersion: 1, themes: ['valid-theme'] }, null, 2)}\n`
  );

  const result = await runValidator(root);

  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /Theme validation passed/);
});

test('requires the root README to link each catalog theme id', async () => {
  const root = await createRoot();
  await writeTheme(root, 'linked-theme');
  await writeFile(path.join(root, 'README.md'), '# VRCX-0 Community Themes\n');
  await writeFile(
    path.join(root, 'themes', 'index.json'),
    `${JSON.stringify({ schemaVersion: 1, themes: ['linked-theme'] }, null, 2)}\n`
  );

  const result = await runValidator(root);

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /README\.md: missing theme link for "linked-theme"/);
});

test('reports duplicate ids, missing tags, invalid JSON, and preview issues', async () => {
  const root = await createRoot();
  await writeReadme(root, ['duplicate-theme']);
  await writeFile(
    path.join(root, 'themes', 'index.json'),
    `${JSON.stringify({ schemaVersion: 1, themes: ['duplicate-theme', 'duplicate-theme'] }, null, 2)}\n`
  );

  await writeTheme(root, 'duplicate-theme', { tags: [] });
  await writeFile(path.join(root, 'themes', 'duplicate-theme', 'preview.webp'), Buffer.alloc(256 * 1024 + 1, 0));

  const invalidDir = path.join(root, 'themes', 'invalid-json');
  await mkdir(invalidDir, { recursive: true });
  await writeFile(path.join(invalidDir, 'theme.json'), '{ invalid json\n');
  await writeFile(path.join(invalidDir, 'theme.css'), ':root {}\n');
  await writeFile(path.join(invalidDir, 'preview.webp'), Buffer.from('not webp\n'));

  const result = await runValidator(root);

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /themes\/index\.json: duplicate theme id "duplicate-theme"/);
  assert.match(result.output, /themes\/duplicate-theme\/theme\.json: tags must contain at least one tag/);
  assert.match(result.output, /themes\/invalid-json\/theme\.json: invalid JSON/);
  assert.match(result.output, /themes\/duplicate-theme\/preview\.webp: file size .* exceeds 256 KiB/);
  assert.match(result.output, /themes\/invalid-json\/preview\.webp: file is not a WebP image/);
});
