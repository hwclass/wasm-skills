#!/usr/bin/env node
import assert from 'assert';
import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const fsp = fs.promises;

const root = path.resolve(new URL('../../..', import.meta.url).pathname);
const mode = process.argv[2] || 'all';

const requiredPaths = [
  'README.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'LICENSE',
  'fixtures/app.wasm',
  'install.sh',
  'package.json',
  'skills/wasm-build/SKILL.md',
  'skills/wasm-build/README.md',
  'skills/wasm-build/references/target-selection.md',
  'skills/wasm-build/references/language-recipes.md',
  'skills/wasm-build/references/failure-diagnosis.md',
  'skills/wasm-build/references/runtime-validation.md',
  'skills/wasm-build/assets/build-plan.template.md',
  'skills/wasm-build/assets/build-plan.examples.md',
  'skills/wasm-build/scripts/inspect-wasm-project.mjs',
  'skills/wasm-build/scripts/inspect-wasm-artifact.mjs',
  'skills/wasm-build/evals/trigger-queries.json',
  'skills/wasm-build/evals/build-cases.json'
];

const runtimes = ['Browser', 'Node', 'WASI Preview 1', 'WASI Preview 2', 'Component Model', 'Wasmtime', 'WasmEdge', 'Spin', 'Extism', 'Unknown'];
const runtimeFields = ['whenToChoose', 'whenNotToChoose', 'supportedOrCommonLanguages', 'recommendedToolchains', 'artifactExpectation', 'validationStrategy', 'runtimeAssumptions', 'knownPitfalls', 'negativeCase'];
const tier1 = ['Rust', 'TinyGo', 'C', 'C++', 'JavaScript'];
const tier2 = ['Python', 'Zig', 'AssemblyScript'];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    ...options
  });
}

function assertIncludes(text, value, file) {
  assert.ok(text.includes(value), `${file} missing ${value}`);
}

function isSorted(values) {
  return values.every((value, index) => index === 0 || values[index - 1] <= value);
}

function parseJsonBlocks(markdown, file) {
  const blocks = [...markdown.matchAll(/```json\n([\s\S]*?)\n```/g)].map((match) => JSON.parse(match[1]));
  assert.ok(blocks.length > 0, `${file} has no JSON examples`);
  return blocks;
}

function validWasmBytes() {
  return Buffer.from([0, 0x61, 0x73, 0x6d, 1, 0, 0, 0]);
}

function inspectProject(projectRoot) {
  return execFileSync(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-project.mjs', projectRoot], { cwd: root, encoding: 'utf8' });
}

async function withTempDir(fn) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'wasm-skills-'));
  try {
    return await fn(dir);
  } finally {
    await fsp.rm(dir, { recursive: true, force: true });
  }
}

async function copyRecursive(source, destination) {
  const stat = await fsp.lstat(source);
  if (stat.isDirectory()) {
    await fsp.mkdir(destination, { recursive: true });
    const entries = await fsp.readdir(source);
    for (const entry of entries) {
      if (entry === '.git' || entry === '.agents') continue;
      await copyRecursive(path.join(source, entry), path.join(destination, entry));
    }
  } else if (stat.isFile()) {
    await fsp.copyFile(source, destination);
    await fsp.chmod(destination, stat.mode);
  }
}

async function validateStructure() {
  for (const rel of requiredPaths) {
    assert.ok(fs.existsSync(path.join(root, rel)), `missing ${rel}`);
  }
  for (const dir of ['rust-browser', 'rust-wasi', 'rust-component', 'tinygo-minimal', 'c-wasi-minimal', 'js-component-minimal']) {
    assert.ok(fs.existsSync(path.join(root, 'skills/wasm-build/examples', dir, 'README.md')), `missing example ${dir}`);
  }
}

async function validateContent() {
  const skill = read('skills/wasm-build/SKILL.md');
  for (const term of ['WebAssembly', 'WASI Preview 1', 'WASI Preview 2 / Component Model', 'browser Wasm', 'WIT', 'wasm-bindgen', 'Emscripten', 'wasi-sdk', 'Wasmtime', 'WasmEdge', 'Extism', 'Spin', 'jco', 'build failure diagnosis']) {
    assertIncludes(skill, term, 'SKILL.md');
  }
  assertIncludes(skill, 'must not modify project files', 'SKILL.md');
  assertIncludes(skill, 'explicitly requested execution', 'SKILL.md');

  const targetSelection = read('skills/wasm-build/references/target-selection.md');
  for (const runtime of runtimes) assertIncludes(targetSelection, `## ${runtime}`, 'target-selection.md');
  for (const field of runtimeFields) assertIncludes(targetSelection, field, 'target-selection.md');
  assertIncludes(targetSelection, 'categories overlap', 'target-selection.md');

  const recipes = read('skills/wasm-build/references/language-recipes.md');
  for (const language of tier1) assertIncludes(recipes, `Tier 1: ${language}`, 'language-recipes.md');
  for (const language of tier2) assertIncludes(recipes, `Tier 2: ${language}`, 'language-recipes.md');
  assertIncludes(recipes, 'does not claim parity with Tier 1', 'language-recipes.md');

  const diagnosis = read('skills/wasm-build/references/failure-diagnosis.md');
  for (const field of ['Symptoms', 'Likely causes', 'Inspection steps', 'Recommended next action', 'Unsafe action to avoid']) assertIncludes(diagnosis, field, 'failure-diagnosis.md');

  const validation = read('skills/wasm-build/references/runtime-validation.md');
  for (const runtime of ['Browser', 'Node.js', 'Wasmtime', 'WasmEdge', 'Spin', 'Extism', 'jco / Transpiled Components', 'Generic Artifact Validation']) {
    assertIncludes(validation, runtime, 'runtime-validation.md');
  }
}

async function validateFixtures() {
  const triggers = JSON.parse(read('skills/wasm-build/evals/trigger-queries.json'));
  assert.equal(triggers.schemaVersion, '1.0');
  assert.ok(triggers.shouldActivate.length >= 12);
  assert.ok(triggers.shouldNotActivate.length >= 8);
  assert.ok(triggers.falsePositiveCases.length >= 4);
  assert.ok(triggers.falseNegativePrevention.length >= 4);
  const categories = new Set(triggers.shouldNotActivate.map((item) => item.category));
  for (const category of [
    'native non-Wasm compilation',
    'general AI or LLM questions',
    'package-manager usage unrelated to Wasm',
    'container or GPU model serving',
    'generic CI configuration',
    'runtime hosting without a Wasm build decision',
    'ordinary JavaScript/browser debugging',
    'generic Rust build failures with no Wasm target',
    'WebAssembly conceptual questions that do not require build planning'
  ]) {
    assert.ok(categories.has(category), `missing non-trigger category ${category}`);
  }

  const cases = JSON.parse(read('skills/wasm-build/evals/build-cases.json'));
  assert.equal(cases.schemaVersion, '1.0');
  assert.ok(cases.cases.length >= 6);

  const template = read('skills/wasm-build/assets/build-plan.template.md');
  const fieldOrder = ['schemaVersion', 'projectRoot', 'detectedFacts', 'intendedEnvironment', 'runtime', 'target', 'artifactType', 'language', 'toolchain', 'buildCommand', 'validationCommands', 'smokeTestCommand', 'filesExpectedToChange', 'risks', 'fallbackPath', 'documentationUpdates', 'approvalRequired'];
  let previous = -1;
  for (const field of fieldOrder) {
    const index = template.indexOf(`"${field}"`);
    assert.ok(index > previous, `BuildPlan field order issue: ${field}`);
    previous = index;
  }

  const allowedRuntime = new Set(['browser', 'node', 'wasi-preview1', 'wasi-preview2', 'component-model', 'wasmtime', 'wasmedge', 'spin', 'extism', 'unknown']);
  const allowedArtifactType = new Set(['core-module', 'wasi-command', 'component', 'js-bound-module', 'unknown']);
  const buildPlanExamples = parseJsonBlocks(read('skills/wasm-build/assets/build-plan.examples.md'), 'build-plan.examples.md');
  assert.equal(buildPlanExamples.length, 6);
  for (const example of buildPlanExamples) {
    assert.deepEqual(Object.keys(example), fieldOrder, `BuildPlan field order issue in ${example.language}`);
    assert.ok(allowedRuntime.has(example.runtime), `unsupported runtime ${example.runtime}`);
    assert.ok(allowedArtifactType.has(example.artifactType), `unsupported artifactType ${example.artifactType}`);
    assert.equal(example.projectRoot, null);
    for (const field of ['detectedFacts', 'validationCommands', 'filesExpectedToChange', 'risks', 'documentationUpdates']) {
      assert.ok(Array.isArray(example[field]), `${field} must be an array`);
    }
    assert.ok(isSorted(example.detectedFacts.map((item) => item.path)), `detectedFacts not sorted for ${example.language}`);
    assert.ok(isSorted(example.filesExpectedToChange), `filesExpectedToChange not sorted for ${example.language}`);
    assert.ok(isSorted(example.risks.map((item) => item.id)), `risks not sorted for ${example.language}`);
    assert.ok(isSorted(example.documentationUpdates), `documentationUpdates not sorted for ${example.language}`);
    assert.equal(example.approvalRequired, true);
    assert.ok(!JSON.stringify(example).match(/\d{4}-\d{2}-\d{2}|random|uuid/i), `non-deterministic data in ${example.language}`);
  }
}

async function validateInstall() {
  await withTempDir(async (tmp) => {
    const repo = path.join(tmp, 'repo');
    await copyRecursive(root, repo);
    const env = { ...process.env, HOME: path.join(tmp, 'home') };
    const runInstall = (args) => spawnSync('./install.sh', args, { cwd: repo, env, encoding: 'utf8' });

    let result = runInstall(['wasm-build', '--project']);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(repo, '.agents/skills/wasm-build/SKILL.md')));

    result = runInstall(['wasm-build', '--project']);
    assert.equal(result.status, 3, result.stderr);

    result = runInstall(['wasm-build', '--project', '--force']);
    assert.equal(result.status, 0, result.stderr);

    result = runInstall(['rust-build', '--project']);
    assert.equal(result.status, 2);

    result = runInstall(['wasm-build']);
    assert.equal(result.status, 2);

    result = runInstall(['wasm-build', '--global']);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(env.HOME, '.agents/skills/wasm-build/SKILL.md')));

    result = runInstall(['wasm-build', '--uninstall', '--project']);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(repo, '.agents/skills')));
    assert.ok(!fs.existsSync(path.join(repo, '.agents/skills/wasm-build')));

    result = runInstall(['wasm-build', '--uninstall', '--project']);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /not installed/);

    result = runInstall(['wasm-build', '--uninstall', '--global']);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(env.HOME, '.agents/skills')));
  });

  await withTempDir(async (tmp) => {
    const repo = path.join(tmp, 'repo');
    await copyRecursive(root, repo);
    const blockedHome = path.join(tmp, 'home-file');
    await fsp.writeFile(blockedHome, 'not a directory\n');
    const result = spawnSync('./install.sh', ['wasm-build', '--global'], {
      cwd: repo,
      env: { ...process.env, HOME: blockedHome },
      encoding: 'utf8'
    });
    assert.equal(result.status, 4);
    assert.match(result.stderr, /Permission denied:/);
    assert.ok(!fs.existsSync(path.join(blockedHome, '.agents')));
    assert.ok(!fs.existsSync(path.join(blockedHome, '.agents/skills/wasm-build')));
  });
}

async function validateScripts() {
  await validateProjectInspection();
  await validateArtifactInspection();
}

async function validateProjectInspection() {
  await withTempDir(async (tmp) => {
    await fsp.writeFile(path.join(tmp, 'Cargo.toml'), '[package]\nname = "x"\nversion = "0.1.0"\n');
    await fsp.writeFile(path.join(tmp, 'package.json'), '{"scripts":{"build:wasm":"wasm-pack build"},"devDependencies":{"assemblyscript":"latest"}}\n');
    await fsp.mkdir(path.join(tmp, 'src'));
    await fsp.writeFile(path.join(tmp, 'src/main.rs'), 'fn main() {}\n');
    await fsp.writeFile(path.join(tmp, 'src/lib.as.ts'), 'export function x(): i32 { return 1; }\n');
    await fsp.mkdir(path.join(tmp, 'node_modules'));
    await fsp.writeFile(path.join(tmp, 'node_modules/ignored.wasm'), '');
    await fsp.symlink('/', path.join(tmp, 'escape'));

    const first = inspectProject(tmp);
    const second = inspectProject(tmp);
    assert.equal(first, second);
    const report = JSON.parse(first);
    assert.deepEqual(report.languages, ['assemblyscript', 'javascript', 'rust']);
    assert.equal(report.truncated, false);
    assert.equal(report.projectRoot, tmp);
    assert.ok(!JSON.stringify(report).includes('ignored.wasm'));
    assert.ok(!JSON.stringify(report).includes('/etc'));
  });

  await withTempDir(async (tmp) => {
    await fsp.writeFile(path.join(tmp, 'go.mod'), 'module example.test/plain\n');
    await fsp.writeFile(path.join(tmp, 'main.go'), 'package main\nfunc main() {}\n');
    const report = JSON.parse(inspectProject(tmp));
    assert.deepEqual(report.languages, ['go']);
    assert.ok(!report.toolchainHints.includes('tinygo'));
  });

  await withTempDir(async (tmp) => {
    await fsp.writeFile(path.join(tmp, 'go.mod'), 'module example.test/tinygo-make\n');
    await fsp.writeFile(path.join(tmp, 'main.go'), 'package main\nfunc main() {}\n');
    await fsp.writeFile(path.join(tmp, 'Makefile'), 'build:\n\ttinygo build -target=wasi -o app.wasm .\n');
    const first = inspectProject(tmp);
    const second = inspectProject(tmp);
    assert.equal(first, second);
    const report = JSON.parse(first);
    assert.deepEqual(report.languages, ['go', 'tinygo']);
    assert.ok(report.toolchainHints.includes('tinygo'));
    assert.deepEqual(report.buildFiles, ['Makefile']);
  });

  await withTempDir(async (tmp) => {
    await fsp.writeFile(path.join(tmp, 'go.mod'), 'module example.test/tinygo-package\n');
    await fsp.writeFile(path.join(tmp, 'package.json'), '{"scripts":{"check:tinygo":"tinygo test -target=wasi ./..."}}\n');
    const report = JSON.parse(inspectProject(tmp));
    assert.deepEqual(report.languages, ['go', 'javascript', 'tinygo']);
    assert.deepEqual(report.packageScripts, [{ name: 'check:tinygo', command: 'tinygo test -target=wasi ./...' }]);
  });

  await withTempDir(async (tmp) => {
    await fsp.writeFile(path.join(tmp, 'go.mod'), 'module example.test/tinygo-ci\n');
    await fsp.mkdir(path.join(tmp, '.github/workflows'), { recursive: true });
    await fsp.writeFile(path.join(tmp, '.github/workflows/wasm.yml'), 'jobs:\n  build:\n    steps:\n      - run: tinygo version\n');
    const report = JSON.parse(inspectProject(tmp));
    assert.deepEqual(report.languages, ['go', 'tinygo']);
    assert.deepEqual(report.ciFiles, ['.github/workflows/wasm.yml']);
  });

  await withTempDir(async (tmp) => {
    await fsp.writeFile(path.join(tmp, 'package.json'), '{bad json\n');
    await fsp.mkdir(path.join(tmp, 'node_modules'));
    await fsp.writeFile(path.join(tmp, 'node_modules/ignored.wasm'), '');
    await fsp.symlink('/', path.join(tmp, 'escape'));
    let unreadablePath = null;
    if (typeof process.getuid !== 'function' || process.getuid() !== 0) {
      unreadablePath = path.join(tmp, 'closed');
      await fsp.mkdir(unreadablePath);
      await fsp.chmod(unreadablePath, 0);
    }
    try {
      const first = inspectProject(tmp);
      const second = inspectProject(tmp);
      assert.equal(first, second);
      const report = JSON.parse(first);
      assert.ok(report.warnings.some((warning) => warning.code === 'malformed-manifest' && warning.path === 'package.json'));
      if (unreadablePath) {
        assert.ok(report.warnings.some((warning) => warning.code === 'unreadable-directory' && warning.path === 'closed'));
      }
      assert.ok(!JSON.stringify(report).includes('ignored.wasm'));
      assert.ok(!JSON.stringify(report).includes('/etc'));
    } finally {
      if (unreadablePath) await fsp.chmod(unreadablePath, 0o700);
    }
  });

  await withTempDir(async (tmp) => {
    let dir = tmp;
    for (let index = 0; index < 10; index++) {
      dir = path.join(dir, `level-${index}`);
      await fsp.mkdir(dir);
    }
    const report = JSON.parse(inspectProject(tmp));
    assert.equal(report.truncated, true);
    assert.ok(isSorted(report.warnings.map((warning) => JSON.stringify(warning))));
  });
}

async function writeFakeTool(bin, name, body) {
  const file = path.join(bin, name);
  await fsp.writeFile(file, `#!/bin/sh\n${body}\n`);
  await fsp.chmod(file, 0o755);
}

async function validateArtifactInspection() {
  await withTempDir(async (tmp) => {
    const bad = run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', path.join(tmp, 'missing.wasm')]);
    assert.equal(bad.status, 2);
    const nonWasm = path.join(tmp, 'not.txt');
    await fsp.writeFile(nonWasm, 'x');
    assert.equal(run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', nonWasm]).status, 2);
    const dirWasm = path.join(tmp, 'directory.wasm');
    await fsp.mkdir(dirWasm);
    const dirResult = run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', dirWasm]);
    assert.equal(dirResult.status, 2);
    assert.match(dirResult.stderr, /regular \.wasm file/);
    const wasm = path.join(tmp, 'artifact with spaces.wasm');
    await fsp.writeFile(wasm, validWasmBytes());
    const artifact = run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', wasm], { env: { ...process.env, PATH: path.join(tmp, 'missing-tools') } });
    assert.equal(artifact.status, 0, artifact.stderr);
    const artifactReport = JSON.parse(artifact.stdout);
    assert.equal(artifactReport.wasmHeaderValid, true);
    assert.ok(artifactReport.validation.every((item) => ['skipped', 'valid', 'invalid', 'error', 'timeout'].includes(item.status)));
    assert.equal(artifactReport.validation.find((item) => item.name === 'wasmtime').status, 'skipped');
    assert.ok(artifactReport.validation.some((item) => item.status === 'skipped' && item.summary === 'Tool not found'));

    const unsafeName = path.join(tmp, 'artifact;$(touch should-not-exist).wasm');
    await fsp.writeFile(unsafeName, validWasmBytes());
    const unsafe = run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', unsafeName], { env: { ...process.env, PATH: path.join(tmp, 'missing-tools') } });
    assert.equal(unsafe.status, 0, unsafe.stderr);
    assert.ok(!fs.existsSync(path.join(tmp, 'should-not-exist')));

    const invalid = path.join(tmp, 'invalid.wasm');
    await fsp.writeFile(invalid, 'not wasm');
    const invalidResult = run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', invalid], { env: { ...process.env, PATH: path.join(tmp, 'missing-tools') } });
    assert.equal(invalidResult.status, 0, invalidResult.stderr);
    const invalidReport = JSON.parse(invalidResult.stdout);
    assert.equal(invalidReport.wasmHeaderValid, false);
    assert.ok(invalidReport.warnings.some((warning) => warning.code === 'invalid-magic'));
  });

  await withTempDir(async (tmp) => {
    const wasm = path.join(tmp, 'validated.wasm');
    await fsp.writeFile(wasm, validWasmBytes());
    const link = path.join(tmp, 'linked.wasm');
    await fsp.symlink(wasm, link);
    const linkResult = run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', link]);
    assert.equal(linkResult.status, 2);

    const bin = path.join(tmp, 'bin');
    const marker = path.join(tmp, 'wasmtime-executed');
    await fsp.mkdir(bin);
    await writeFakeTool(bin, 'file', 'printf "WebAssembly module\\n"; exit 0');
    await writeFakeTool(bin, 'wasm-tools', 'i=0; while [ "$i" -lt 70000 ]; do printf x; i=$((i + 1)); done; exit 0');
    await writeFakeTool(bin, 'wasm-objdump', 'i=0; while [ "$i" -lt 70000 ]; do printf y >&2; i=$((i + 1)); done; exit 1');
    await writeFakeTool(bin, 'jco', '/bin/sleep 10; exit 0');
    await writeFakeTool(bin, 'wasmtime', 'touch "$WASM_MARKER"; exit 0');
    const result = run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', wasm], { env: { ...process.env, PATH: bin, WASM_MARKER: marker } });
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    const byName = Object.fromEntries(report.validation.map((item) => [item.name, item]));
    assert.equal(byName.file.status, 'valid');
    assert.equal(byName['wasm-tools'].status, 'valid');
    assert.equal(byName['wasm-tools'].stdout.length, 64 * 1024);
    assert.equal(byName['wasm-objdump'].status, 'invalid');
    assert.equal(byName['wasm-objdump'].stderr.length, 64 * 1024);
    assert.equal(byName.jco.status, 'timeout');
    assert.equal(byName.jco.timedOut, true);
    assert.equal(byName.wasmtime.status, 'skipped');
    assert.ok(!fs.existsSync(marker));
    assert.ok(report.validation.every((item) => ['skipped', 'valid', 'invalid', 'error', 'timeout'].includes(item.status)));
  });
}

async function runMode(selected) {
  if (selected === 'structure') return validateStructure();
  if (selected === 'content') return validateContent();
  if (selected === 'fixtures') return validateFixtures();
  if (selected === 'install') return validateInstall();
  if (selected === 'scripts') return validateScripts();
  if (selected === 'evals') return validateFixtures();
  if (selected === 'all') {
    await validateStructure();
    await validateContent();
    await validateFixtures();
    await validateInstall();
    await validateScripts();
    return;
  }
  throw new Error(`Unknown validation mode: ${selected}`);
}

try {
  await runMode(mode);
  console.log(`[OK] ${mode}`);
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
