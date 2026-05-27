#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_PREVIEW_BYTES = 256 * 1024;
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERSION_PATTERN = /^([1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const TESTED_WITH_PATTERN = /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/;
const GITHUB_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

const scriptRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

function parseArgs(argv) {
  const rootIndex = argv.indexOf('--root');
  if (rootIndex === -1) {
    return scriptRoot;
  }
  const root = argv[rootIndex + 1];
  if (!root) {
    throw new Error('--root requires a path');
  }
  return path.resolve(root);
}

function toDisplayPath(root, filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/');
}

async function readJson(root, filePath, errors) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    const message = error instanceof SyntaxError ? `invalid JSON: ${error.message}` : error.message;
    errors.push(`${toDisplayPath(root, filePath)}: ${message}`);
    return null;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function addStringError(errors, file, field, value, { minLength = 1, maxLength, pattern } = {}) {
  if (typeof value !== 'string') {
    errors.push(`${file}: ${field} must be a string`);
    return;
  }
  if (value.length < minLength) {
    errors.push(`${file}: ${field} must not be empty`);
  }
  if (maxLength !== undefined && value.length > maxLength) {
    errors.push(`${file}: ${field} must be ${maxLength} characters or fewer`);
  }
  if (pattern && !pattern.test(value)) {
    errors.push(`${file}: ${field} has an invalid format`);
  }
}

function validateCatalog(root, catalog, catalogPath, errors) {
  const file = toDisplayPath(root, catalogPath);
  if (!catalog) {
    return [];
  }
  if (!isPlainObject(catalog)) {
    errors.push(`${file}: catalog must be a JSON object`);
    return [];
  }
  if (catalog.schemaVersion !== 1) {
    errors.push(`${file}: schemaVersion must be 1`);
  }
  if (!Array.isArray(catalog.themes)) {
    errors.push(`${file}: themes must be an array`);
    return [];
  }

  const seen = new Set();
  for (const id of catalog.themes) {
    if (typeof id !== 'string') {
      errors.push(`${file}: each theme id must be a string`);
      continue;
    }
    if (!ID_PATTERN.test(id)) {
      errors.push(`${file}: theme id "${id}" has an invalid format`);
    }
    if (seen.has(id)) {
      errors.push(`${file}: duplicate theme id "${id}"`);
    }
    seen.add(id);
  }
  return catalog.themes.filter((id) => typeof id === 'string');
}

function validateManifest(root, manifest, manifestPath, directoryName, errors) {
  const file = toDisplayPath(root, manifestPath);
  if (!manifest) {
    return null;
  }
  if (!isPlainObject(manifest)) {
    errors.push(`${file}: theme manifest must be a JSON object`);
    return null;
  }

  addStringError(errors, file, 'id', manifest.id, { pattern: ID_PATTERN });
  if (typeof manifest.id === 'string' && manifest.id !== directoryName) {
    errors.push(`${file}: id "${manifest.id}" must match directory name "${directoryName}"`);
  }
  addStringError(errors, file, 'name', manifest.name, { maxLength: 80 });
  addStringError(errors, file, 'version', manifest.version, { pattern: VERSION_PATTERN });
  addStringError(errors, file, 'description', manifest.description, { maxLength: 240 });
  addStringError(errors, file, 'testedWith', manifest.testedWith, { pattern: TESTED_WITH_PATTERN });

  if (!isPlainObject(manifest.author)) {
    errors.push(`${file}: author must be an object`);
  } else {
    addStringError(errors, file, 'author.name', manifest.author.name, { maxLength: 80 });
    addStringError(errors, file, 'author.github', manifest.author.github, { pattern: GITHUB_PATTERN });
    if (manifest.author.url !== undefined) {
      addStringError(errors, file, 'author.url', manifest.author.url, { maxLength: 240 });
      try {
        new URL(manifest.author.url);
      } catch {
        errors.push(`${file}: author.url must be a valid URL`);
      }
    }
  }

  if (!Array.isArray(manifest.tags)) {
    errors.push(`${file}: tags must be an array`);
  } else {
    if (manifest.tags.length < 1) {
      errors.push(`${file}: tags must contain at least one tag`);
    }
    if (manifest.tags.length > 3) {
      errors.push(`${file}: tags must contain at most three tags`);
    }
    const seenTags = new Set();
    for (const tag of manifest.tags) {
      if (typeof tag !== 'string' || tag.length === 0 || tag.length > 24) {
        errors.push(`${file}: each tag must be a non-empty string no longer than 24 characters`);
        continue;
      }
      if (seenTags.has(tag)) {
        errors.push(`${file}: duplicate tag "${tag}"`);
      }
      seenTags.add(tag);
    }
  }

  if (typeof manifest.remoteAssets !== 'boolean') {
    errors.push(`${file}: remoteAssets must be a boolean`);
  }
  if (typeof manifest.darkMode !== 'boolean') {
    errors.push(`${file}: darkMode must be a boolean`);
  }
  if (typeof manifest.accentMode !== 'boolean') {
    errors.push(`${file}: accentMode must be a boolean`);
  }

  return typeof manifest.id === 'string' ? manifest.id : null;
}

async function validatePreview(root, previewPath, errors) {
  const file = toDisplayPath(root, previewPath);
  let fileStat;
  try {
    fileStat = await stat(previewPath);
  } catch (error) {
    errors.push(`${file}: missing required preview.webp`);
    return;
  }

  if (fileStat.size > MAX_PREVIEW_BYTES) {
    errors.push(`${file}: file size ${fileStat.size} bytes exceeds 256 KiB`);
  }

  const header = await readFile(previewPath);
  if (header.subarray(0, 4).toString('ascii') !== 'RIFF' || header.subarray(8, 12).toString('ascii') !== 'WEBP') {
    errors.push(`${file}: file is not a WebP image`);
  }
}

async function validate(root) {
  const errors = [];
  const themesRoot = path.join(root, 'themes');
  const catalogPath = path.join(themesRoot, 'index.json');
  const catalog = await readJson(root, catalogPath, errors);
  const catalogIds = validateCatalog(root, catalog, catalogPath, errors);
  const catalogIdSet = new Set(catalogIds);

  let entries = [];
  try {
    entries = await readdir(themesRoot, { withFileTypes: true });
  } catch (error) {
    errors.push(`${toDisplayPath(root, themesRoot)}: ${error.message}`);
  }

  const manifestIds = new Map();
  const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  for (const directoryName of directories) {
    const themeDir = path.join(themesRoot, directoryName);
    const manifestPath = path.join(themeDir, 'theme.json');
    const manifest = await readJson(root, manifestPath, errors);
    const manifestId = validateManifest(root, manifest, manifestPath, directoryName, errors);
    await validatePreview(root, path.join(themeDir, 'preview.webp'), errors);

    if (!catalogIdSet.has(directoryName)) {
      errors.push(`${toDisplayPath(root, themeDir)}: theme directory is missing from themes/index.json`);
    }
    if (manifestId) {
      const existingPath = manifestIds.get(manifestId);
      if (existingPath) {
        errors.push(`${toDisplayPath(root, manifestPath)}: duplicate theme id "${manifestId}" also used by ${existingPath}`);
      } else {
        manifestIds.set(manifestId, toDisplayPath(root, manifestPath));
      }
    }
  }

  for (const id of catalogIdSet) {
    if (!directories.includes(id)) {
      errors.push(`${toDisplayPath(root, catalogPath)}: theme id "${id}" has no matching themes/${id} directory`);
    }
  }

  return errors;
}

try {
  const root = parseArgs(process.argv.slice(2));
  const errors = await validate(root);
  if (errors.length > 0) {
    console.error(`Theme validation failed with ${errors.length} error(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  } else {
    console.log('Theme validation passed.');
  }
} catch (error) {
  console.error(`Theme validation failed: ${error.message}`);
  process.exitCode = 1;
}
