#!/usr/bin/env node
import fsModule from 'fs';
import path from 'path';

const fs = fsModule.promises;

const SCHEMA_VERSION = '1.0';
const MAX_DEPTH = 8;
const MAX_ENTRIES = 10000;
const MAX_OUTPUT_BYTES = 1024 * 1024;
const IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  'target',
  'dist',
  'build',
  '.venv',
  'venv',
  'vendor',
  '.cache',
  '.next',
  '.turbo',
  'coverage'
]);

const rootArg = process.argv[2] || '.';
const warnings = [];
let traversed = 0;
let truncated = false;

function posixRel(root, file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function addSorted(set, value) {
  if (value) set.add(value);
}

async function statSafe(file) {
  try {
    return await fs.lstat(file);
  } catch (error) {
    warnings.push({ code: 'unreadable-path', path: file, message: error.message });
    return null;
  }
}

async function readJsonWarning(root, file) {
  try {
    JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    warnings.push({ code: 'malformed-manifest', path: posixRel(root, file), message: error.message });
  }
}

const result = {
  schemaVersion: SCHEMA_VERSION,
  projectRoot: '',
  languages: [],
  manifestFiles: [],
  buildFiles: [],
  witFiles: [],
  wasmArtifacts: [],
  runtimeConfigs: [],
  ciFiles: [],
  dockerFiles: [],
  packageScripts: [],
  toolchainHints: [],
  warnings: [],
  truncated: false
};

const languages = new Set();
const buildFiles = new Set();
const witFiles = new Set();
const ciFiles = new Set();
const dockerFiles = new Set();
const toolchainHints = new Set();
const manifestMap = new Map();
const runtimeConfigMap = new Map();
const wasmMap = new Map();
const packageScriptMap = new Map();

function manifest(type, rel) {
  manifestMap.set(`${type}:${rel}`, { type, path: rel });
}

function runtimeConfig(type, rel) {
  runtimeConfigMap.set(`${type}:${rel}`, { type, path: rel });
}

function wasmArtifact(rel, bytes) {
  wasmMap.set(rel, { path: rel, bytes });
}

function detectTinyGoCommand(text) {
  return /\btinygo\s+(build|test|version)\b/.test(text);
}

function recordTinyGoEvidence() {
  languages.add('tinygo');
  toolchainHints.add('tinygo');
}

async function inspectFile(root, abs, name, rel, stat) {
  if (name === 'Cargo.toml') {
    languages.add('rust');
    manifest('cargo', rel);
  } else if (name === 'go.mod') {
    languages.add('go');
    manifest('go-mod', rel);
  } else if (name === 'package.json') {
    languages.add('javascript');
    manifest('package-json', rel);
    await inspectPackageJson(root, abs);
  } else if (name === 'CMakeLists.txt') {
    buildFiles.add(rel);
    languages.add('c');
    languages.add('cpp');
  } else if (name === 'Makefile') {
    buildFiles.add(rel);
    await inspectTextHints(root, abs, rel);
  } else if (name === 'spin.toml') {
    runtimeConfig('spin', rel);
  } else if (name === 'component.json') {
    runtimeConfig('component', rel);
  } else if (name === 'Dockerfile' || name.startsWith('Dockerfile.')) {
    dockerFiles.add(rel);
  } else if (rel.startsWith('.github/workflows/') || rel.startsWith('.gitlab-ci')) {
    ciFiles.add(rel);
    await inspectTextHints(root, abs, rel);
  }

  if (name.endsWith('.wit')) witFiles.add(rel);
  if (name.endsWith('.wasm')) wasmArtifact(rel, stat.size);
  if (name.endsWith('.zig') || name === 'build.zig') languages.add('zig');
  if (name.endsWith('.py')) languages.add('python');
  if (name.endsWith('.ts') || name.endsWith('.js') || name.endsWith('.mjs') || name.endsWith('.cjs')) languages.add('javascript');
  if (name.endsWith('.c')) languages.add('c');
  if (name.endsWith('.cpp') || name.endsWith('.cc') || name.endsWith('.cxx') || name.endsWith('.hpp')) languages.add('cpp');
  if (name.endsWith('.as.ts')) languages.add('assemblyscript');
  if (name.endsWith('.go')) languages.add('go');
}

async function inspectTextHints(root, abs, rel) {
  try {
    const text = await fs.readFile(abs, 'utf8');
    for (const hint of ['wasm32-wasip1', 'wasm32-wasi', 'wasm32-unknown-unknown', 'wasm-bindgen', 'emcc', 'tinygo', 'jco', 'cargo component']) {
      if (text.includes(hint)) toolchainHints.add(hint);
    }
    if (detectTinyGoCommand(text)) recordTinyGoEvidence();
  } catch (error) {
    warnings.push({ code: 'unreadable-file', path: rel, message: error.message });
  }
}

async function inspectPackageJson(root, abs) {
  const rel = posixRel(root, abs);
  let json;
  try {
    json = JSON.parse(await fs.readFile(abs, 'utf8'));
  } catch (error) {
    warnings.push({ code: 'malformed-manifest', path: rel, message: error.message });
    return;
  }
  const deps = { ...json.dependencies, ...json.devDependencies };
  if (deps.assemblyscript || deps.asc) languages.add('assemblyscript');
  if (deps['@bytecodealliance/jco'] || deps.jco) toolchainHints.add('jco');
  if (deps['@bytecodealliance/componentize-js']) toolchainHints.add('componentize-js');
  for (const [name, command] of Object.entries(json.scripts || {})) {
    if (detectTinyGoCommand(String(command))) recordTinyGoEvidence();
    if (/wasm|wasi|jco|component|emscripten|emcc|wasm-pack/i.test(`${name} ${command}`)) {
      packageScriptMap.set(name, { name, command: String(command) });
    }
  }
}

async function walk(root, dir, depth) {
  if (traversed >= MAX_ENTRIES) {
    truncated = true;
    return;
  }
  if (depth > MAX_DEPTH) {
    truncated = true;
    return;
  }

  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    warnings.push({ code: 'unreadable-directory', path: posixRel(root, dir), message: error.message });
    return;
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (traversed >= MAX_ENTRIES) {
      truncated = true;
      break;
    }
    const abs = path.join(dir, entry.name);
    const rel = posixRel(root, abs);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      traversed++;
      await walk(root, abs, depth + 1);
    } else if (entry.isSymbolicLink()) {
      continue;
    } else if (entry.isFile()) {
      traversed++;
      const stat = await statSafe(abs);
      if (stat) await inspectFile(root, abs, entry.name, rel, stat);
    }
  }
}

try {
  const projectRoot = path.resolve(rootArg);
  const rootStat = await statSafe(projectRoot);
  if (!rootStat || !rootStat.isDirectory()) {
    console.error(`Invalid path: ${rootArg}`);
    process.exit(2);
  }
  result.projectRoot = projectRoot;
  await walk(projectRoot, projectRoot, 0);

  result.languages = [...languages].sort();
  result.manifestFiles = [...manifestMap.values()].sort((a, b) => a.path.localeCompare(b.path) || a.type.localeCompare(b.type));
  result.buildFiles = [...buildFiles].sort();
  result.witFiles = [...witFiles].sort();
  result.wasmArtifacts = [...wasmMap.values()].sort((a, b) => a.path.localeCompare(b.path));
  result.runtimeConfigs = [...runtimeConfigMap.values()].sort((a, b) => a.path.localeCompare(b.path) || a.type.localeCompare(b.type));
  result.ciFiles = [...ciFiles].sort();
  result.dockerFiles = [...dockerFiles].sort();
  result.packageScripts = [...packageScriptMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  result.toolchainHints = [...toolchainHints].sort();
  result.warnings = warnings.map((warning) => warning.path && path.isAbsolute(warning.path)
    ? { ...warning, path: posixRel(projectRoot, warning.path) }
    : warning).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  result.truncated = truncated;

  let output = `${JSON.stringify(result, null, 2)}\n`;
  if (Buffer.byteLength(output) > MAX_OUTPUT_BYTES) {
    result.truncated = true;
    result.warnings.push({ code: 'output-truncated', message: 'Serialized output exceeded 1 MiB' });
    result.packageScripts = [];
    output = `${JSON.stringify(result, null, 2)}\n`;
  }
  process.stdout.write(output);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
