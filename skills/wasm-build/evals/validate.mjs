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
  'docs/release-checklist.md',
  'fixtures/app.wasm',
  'install.sh',
  'package.json',
  'skills/wasm-build/SKILL.md',
  'skills/wasm-build/README.md',
  'skills/wasm-build/references/execution-intent.md',
  'skills/wasm-build/references/target-selection.md',
  'skills/wasm-build/references/language-recipes.md',
  'skills/wasm-build/references/failure-diagnosis.md',
  'skills/wasm-build/references/runtime-validation.md',
  'skills/wasm-build/assets/build-plan.template.md',
  'skills/wasm-build/assets/build-plan.examples.md',
  'skills/wasm-build/scripts/inspect-wasm-project.mjs',
  'skills/wasm-build/scripts/inspect-wasm-artifact.mjs',
  'skills/wasm-build/evals/README.md',
  'skills/wasm-build/evals/build-matrix.json',
  'skills/wasm-build/evals/trigger-queries.json',
  'skills/wasm-build/evals/build-cases.json',
  'skills/wasm-build/evals/fixtures/integration-baseline.json',
  'skills/wasm-build/evals/fixtures/rust-browser-evidence.json',
  'skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json',
  'skills/wasm-build/evals/fixtures/js-component-evidence.json',
  'skills/wasm-build/evals/fixtures/missing-prerequisite-approval.json'
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

function readJson(rel) {
  return JSON.parse(read(rel));
}

function parseSkillFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, 'SKILL.md missing YAML frontmatter');
  const entries = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue;
    const field = line.match(/^([a-z][a-z0-9-]*):\s*(.*)$/);
    assert.ok(field, `Unsupported frontmatter line: ${line}`);
    entries[field[1]] = field[2].trim().replace(/^"(.*)"$/, '$1');
  }
  return { entries, body: markdown.slice(match[0].length) };
}

function validWasmBytes() {
  return Buffer.from([0, 0x61, 0x73, 0x6d, 1, 0, 0, 0]);
}

function structuralCoreWasmBytes() {
  return Buffer.from([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x04, 0x01, 0x60, 0x00, 0x00,
    0x02, 0x0c, 0x01, 0x03, 0x65, 0x6e, 0x76, 0x04, 0x68, 0x6f, 0x73, 0x74, 0x00, 0x00,
    0x03, 0x02, 0x01, 0x00,
    0x05, 0x03, 0x01, 0x00, 0x01,
    0x07, 0x10, 0x02, 0x06, 0x6d, 0x65, 0x6d, 0x6f, 0x72, 0x79, 0x02, 0x00, 0x03, 0x72, 0x75, 0x6e, 0x00, 0x01,
    0x0a, 0x04, 0x01, 0x02, 0x00, 0x0b
  ]);
}

function componentHeaderBytes() {
  return Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x0d, 0x00, 0x01, 0x00]);
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
  const discoveryPath = 'skills/wasm-build/SKILL.md';
  assert.equal(discoveryPath.split('/').length, 3);
  assert.ok(fs.existsSync(path.join(root, discoveryPath)), 'canonical Skills CLI discovery path missing');
  assert.ok(fs.readdirSync(path.join(root, 'skills')).includes('wasm-build'), 'skill missing from top-level skills directory');
  for (const dir of ['rust-browser', 'rust-wasi', 'rust-component', 'tinygo-minimal', 'c-wasi-minimal', 'js-component-minimal']) {
    assert.ok(fs.existsSync(path.join(root, 'skills/wasm-build/examples', dir, 'README.md')), `missing example ${dir}`);
  }
  for (const rel of [
    'skills/wasm-build/examples/rust-browser/before/Cargo.toml',
    'skills/wasm-build/examples/rust-browser/before/Cargo.lock',
    'skills/wasm-build/examples/rust-browser/before/index.html',
    'skills/wasm-build/examples/rust-browser/before/src/lib.rs',
    'skills/wasm-build/examples/tinygo-minimal/go.mod',
    'skills/wasm-build/examples/tinygo-minimal/main.go',
    'skills/wasm-build/examples/tinygo-minimal/Makefile',
    'skills/wasm-build/examples/tinygo-minimal/.gitignore',
    'skills/wasm-build/examples/js-component-minimal/package.json',
    'skills/wasm-build/examples/js-component-minimal/component.json',
    'skills/wasm-build/examples/js-component-minimal/src/index.js',
    'skills/wasm-build/examples/js-component-minimal/wit/world.wit',
    'skills/wasm-build/examples/js-component-minimal/.gitignore'
  ]) {
    assert.ok(fs.existsSync(path.join(root, rel)), `missing fixture file ${rel}`);
  }
  for (const rel of [
    'skills/wasm-build/examples/rust-browser/Cargo.toml',
    'skills/wasm-build/examples/rust-browser/index.html',
    'skills/wasm-build/examples/rust-browser/src',
    'skills/wasm-build/examples/rust-browser/target',
    'skills/wasm-build/examples/rust-browser/pkg',
    'skills/wasm-build/examples/rust-browser/before/target',
    'skills/wasm-build/examples/rust-browser/before/pkg'
  ]) {
    assert.ok(!fs.existsSync(path.join(root, rel)), `rust-browser fixture must not include ${rel}`);
  }
}

async function validateContent() {
  const skill = read('skills/wasm-build/SKILL.md');
  const { entries, body } = parseSkillFrontmatter(skill);
  assert.deepEqual(Object.keys(entries).sort(), ['description', 'name']);
  assert.equal(entries.name, 'wasm-build');
  assert.match(entries.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(entries.name.length <= 64);
  assert.ok(entries.description.length > 0);
  assert.ok(entries.description.length <= 1024);
  for (const term of ['WebAssembly', 'Wasm targets', 'validation', 'diagnosing']) {
    assertIncludes(entries.description, term, 'SKILL.md frontmatter description');
  }
  assert.ok(Buffer.byteLength(body, 'utf8') < 10000, 'SKILL.md body exceeds approved size limit');
  for (const rel of [
    'skills/wasm-build/references/target-selection.md',
    'skills/wasm-build/references/execution-intent.md',
    'skills/wasm-build/references/language-recipes.md',
    'skills/wasm-build/references/failure-diagnosis.md',
    'skills/wasm-build/references/runtime-validation.md',
    'skills/wasm-build/scripts/inspect-wasm-project.mjs',
    'skills/wasm-build/scripts/inspect-wasm-artifact.mjs'
  ]) {
    assert.ok(fs.existsSync(path.join(root, rel)), `SKILL.md referenced file missing: ${rel}`);
  }
  for (const term of ['WebAssembly', 'WASI Preview 1', 'WASI Preview 2 / Component Model', 'browser Wasm', 'WIT', 'wasm-bindgen', 'Emscripten', 'wasi-sdk', 'Wasmtime', 'WasmEdge', 'Extism', 'Spin', 'jco', 'build failure diagnosis']) {
    assertIncludes(skill, term, 'SKILL.md');
  }
  assertIncludes(skill, 'must not modify project files', 'SKILL.md');
  assertIncludes(skill, 'explicitly requested execution', 'SKILL.md');
  assertIncludes(skill, 'PLAN, BUILD, REPAIR, or VALIDATE', 'SKILL.md');
  assertIncludes(skill.toLowerCase().replace(/\s+/g, ' '), 'do not ask for redundant approval', 'SKILL.md');
  assertIncludes(skill, 'project-external prerequisites', 'SKILL.md');
  assert.ok(!/BUILD[\s\S]{0,240}wasm-pack/.test(skill), 'SKILL.md must not define BUILD solely through wasm-pack');

  const executionIntent = read('skills/wasm-build/references/execution-intent.md');
  for (const modeName of ['PLAN', 'BUILD', 'REPAIR', 'VALIDATE']) {
    assertIncludes(executionIntent, `## ${modeName}`, 'execution-intent.md');
  }
  for (const term of [
    'language-independent',
    'environment-independent',
    'target environment',
    'artifact type',
    'runtime/host',
    'redundant approval',
    'Project-external or environment-level mutations',
    'wasi-sdk or Emscripten',
    'installing TinyGo',
    'installing jco globally',
    'explicit approval',
    'Do not execute Wasm artifacts in inspection mode',
    'Mentioning `wasm-pack`',
    'Missing language targets must not be silently installed',
    'Missing system packages must not be silently installed'
  ]) {
    assertIncludes(executionIntent, term, 'execution-intent.md');
  }
  assert.ok(!/## BUILD[\s\S]*Rust targets/s.test(executionIntent), 'execution-intent.md must not require Rust-specific BUILD behavior');

  const targetSelection = read('skills/wasm-build/references/target-selection.md');
  for (const runtime of runtimes) assertIncludes(targetSelection, `## ${runtime}`, 'target-selection.md');
  for (const field of runtimeFields) assertIncludes(targetSelection, field, 'target-selection.md');
  assertIncludes(targetSelection, 'categories overlap', 'target-selection.md');
  assertIncludes(targetSelection, 'Do not treat this file as one flat mutually exclusive enum', 'target-selection.md');
  assertIncludes(targetSelection, 'If the intended environment cannot be established safely', 'target-selection.md');
  assertIncludes(targetSelection, 'Representative Conditional Paths', 'target-selection.md');

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

  const readme = read('README.md');
  assertIncludes(readme, 'npx skills add hwclass/wasm-skills --skill wasm-build', 'README.md');
  assertIncludes(readme, './install.sh wasm-build --project', 'README.md');
  assertIncludes(readme, './install.sh wasm-build --global', 'README.md');
  assertIncludes(readme, 'same canonical skill contents', 'README.md');
  assertIncludes(readme, 'public Agent Skills ecosystem path', 'README.md');

  const releaseChecklist = read('docs/release-checklist.md');
  const releaseChecklistLower = releaseChecklist.toLowerCase();
  for (const item of ['repository is public', 'frontmatter validates', 'npx skills add hwclass/wasm-skills --skill wasm-build', 'dashboard indexing or search visibility may occur separately']) {
    assertIncludes(releaseChecklistLower, item, 'release-checklist.md');
  }
  const releaseChecklistPlain = releaseChecklistLower.replace(/`/g, '').replace(/\s+/g, ' ');
  assertIncludes(releaseChecklistLower, '.agents/skills/speckit-*', 'release-checklist.md');
  assert.ok(/\.agents\/skills\/speckit-\*.*(remain|available|preserv)/s.test(releaseChecklistLower), 'release-checklist.md must preserve required Spec Kit skill tooling');
  assertIncludes(releaseChecklistLower, 'generated product-skill installation', 'release-checklist.md');
  assertIncludes(releaseChecklistLower, '.agents/skills/wasm-build/', 'release-checklist.md');
  assert.ok(/(no|must not)[\s\S]*\.agents\/skills\/wasm-build\/[\s\S]*(committed|commit)/.test(releaseChecklistLower), 'release-checklist.md must prohibit committing generated wasm-build installs');
  assertIncludes(releaseChecklistLower, '.gitignore', 'release-checklist.md');
  assert.ok(/\.gitignore[\s\S]*\.agents\/skills\/wasm-build\//.test(releaseChecklistLower), 'release-checklist.md must require a narrow wasm-build ignore rule');
  assert.ok(!releaseChecklistPlain.includes('no generated .agents/ directory is committed'), 'release-checklist.md must not require ignoring the complete .agents directory');
  assert.ok(!releaseChecklistPlain.includes('no generated .agents directory is committed'), 'release-checklist.md must not require ignoring the complete .agents directory');

  const gitignore = read('.gitignore').split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
  assert.ok(gitignore.includes('.agents/skills/wasm-build/'), '.gitignore must narrowly ignore .agents/skills/wasm-build/');
  assert.ok(!gitignore.includes('.agents/'), '.gitignore must not ignore the complete .agents/ directory');
  assert.ok(!fs.existsSync(path.join(root, '.agents/skills/wasm-build')), 'generated .agents/skills/wasm-build/ must not be present');
  const agentSkillsDir = path.join(root, '.agents/skills');
  const specKitSkills = fs.existsSync(agentSkillsDir)
    ? fs.readdirSync(agentSkillsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory() && entry.name.startsWith('speckit-'))
    : [];
  assert.ok(specKitSkills.length > 0, 'required .agents/skills/speckit-* directories must remain present');
  for (const entry of specKitSkills) {
    assert.ok(fs.existsSync(path.join(agentSkillsDir, entry.name, 'SKILL.md')), `${entry.name} missing SKILL.md`);
  }

  const evalReadme = read('skills/wasm-build/evals/README.md');
  assertIncludes(evalReadme, 'repository-owned evaluation infrastructure', 'evals/README.md');
  assertIncludes(evalReadme, 'not a universal Agent Skills schema', 'evals/README.md');
  assertIncludes(evalReadme, 'JSON eval success does not prove route success', 'evals/README.md');
  assertIncludes(evalReadme, 'Optional tool absence', 'evals/README.md');
  const rustBrowserReadme = read('skills/wasm-build/examples/rust-browser/README.md');
  assertIncludes(rustBrowserReadme, 'one route through the general `wasm-build` decision model', 'rust-browser/README.md');
  validateFailureDiagnosisContent();
}

async function validateFixtures() {
  const triggers = JSON.parse(read('skills/wasm-build/evals/trigger-queries.json'));
  assert.equal(triggers.schemaVersion, '1.0');
  assert.ok(triggers.shouldActivate.length >= 12);
  assert.ok(triggers.shouldNotActivate.length >= 8);
  assert.ok(triggers.falsePositiveCases.length >= 4);
  assert.ok(triggers.falseNegativePrevention.length >= 4);
  validateIntentFixtures(triggers);
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
  validateBuildMatrix();
  validateHardeningFixtures();
  validateIntegrationEvidence();
  validateGeneratedOutputAbsence();

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

function validateBuildMatrix() {
  const matrix = JSON.parse(read('skills/wasm-build/evals/build-matrix.json'));
  assert.equal(matrix.schemaVersion, '1.0');
  assertIncludes(matrix.description, 'Repository-owned', 'build-matrix.json');
  assert.ok(Array.isArray(matrix.cases), 'build-matrix cases must be an array');
  assert.ok(matrix.cases.length >= 8, 'build-matrix must include representative supported combinations');

  const languages = new Set();
  const environments = new Set();
  const artifactTypes = new Set();
  const toolchainFamilies = new Set();
  const validationFamilies = new Set();
  const byId = new Map();
  for (const item of matrix.cases) {
    for (const field of ['id', 'language', 'environment', 'artifactType', 'expectedToolchainFamily', 'expectedValidationFamily', 'unsupportedOrAmbiguous']) {
      assert.ok(Object.prototype.hasOwnProperty.call(item, field), `build-matrix case missing ${field}`);
    }
    assert.ok(!byId.has(item.id), `duplicate build-matrix id ${item.id}`);
    byId.set(item.id, item);
    assert.ok(Array.isArray(item.expectedToolchainFamily), `${item.id} expectedToolchainFamily must be array`);
    assert.ok(Array.isArray(item.expectedValidationFamily), `${item.id} expectedValidationFamily must be array`);
    assert.ok(Array.isArray(item.unsupportedOrAmbiguous), `${item.id} unsupportedOrAmbiguous must be array`);
    languages.add(item.language);
    environments.add(item.environment);
    artifactTypes.add(item.artifactType);
    for (const family of item.expectedToolchainFamily) toolchainFamilies.add(family);
    for (const family of item.expectedValidationFamily) validationFamilies.add(family);
  }
  for (const language of ['rust', 'tinygo', 'c', 'cpp', 'javascript']) {
    assert.ok(languages.has(language), `build-matrix missing ${language}`);
  }
  for (const environment of ['browser', 'wasi-preview1', 'component-model', 'extism', 'spin', 'unknown']) {
    assert.ok(environments.has(environment), `build-matrix missing ${environment}`);
  }
  for (const artifactType of ['core-module', 'wasi-command', 'component', 'js-bound-module', 'unknown']) {
    assert.ok(artifactTypes.has(artifactType), `build-matrix missing ${artifactType}`);
  }
  for (const family of ['wasm-pack', 'wasm-bindgen', 'wasi-sdk', 'emscripten', 'tinygo', 'jco']) {
    assert.ok(toolchainFamilies.has(family), `build-matrix missing toolchain family ${family}`);
  }
  for (const family of ['static-wasm-validation', 'browser-smoke-test', 'wasi-runtime-smoke-test', 'component-validation', 'wit-inspection']) {
    assert.ok(validationFamilies.has(family), `build-matrix missing validation family ${family}`);
  }
  assert.ok(byId.get('unknown-rust-environment').unsupportedOrAmbiguous.includes('requires-target-clarification'), 'build-matrix must encode unknown environment ambiguity');
  for (const routeId of ['rust-browser', 'tinygo-wasi', 'js-component']) {
    const item = byId.get(routeId);
    assert.ok(item, `build-matrix missing hardening route ${routeId}`);
    assert.ok(item.fixturePath, `${routeId} missing fixturePath`);
    assert.ok(item.evidencePath, `${routeId} missing evidencePath`);
  }
  assert.ok(matrix.cases.length <= 12, 'build-matrix must remain representative, not Cartesian');
}

function validateHardeningFixtures() {
  const routeChecks = [
    {
      id: 'rust-browser',
      root: 'skills/wasm-build/examples/rust-browser/',
      files: ['README.md', 'before/Cargo.toml', 'before/Cargo.lock', 'before/index.html', 'before/src/lib.rs'],
      readmeTerms: ['Prerequisites', 'Expected Behavior', 'wasm32-unknown-unknown', 'wasm-pack', 'wasm-tools', 'Resetting The Test', 'MUST NOT be committed']
    },
    {
      id: 'tinygo-wasi',
      root: 'skills/wasm-build/examples/tinygo-minimal/',
      files: ['README.md', 'go.mod', 'main.go', 'Makefile', '.gitignore'],
      readmeTerms: ['TinyGo -> WASI', 'tinygo build -target=wasi -o app.wasm .', 'wasm-tools validate app.wasm', 'Reset Instructions', 'must not be installed automatically']
    },
    {
      id: 'js-component',
      root: 'skills/wasm-build/examples/js-component-minimal/',
      files: ['README.md', 'package.json', 'component.json', 'src/index.js', 'wit/world.wit', '.gitignore'],
      readmeTerms: ['JavaScript -> WebAssembly Component Model', 'jco componentize src/index.js --wit wit/world.wit --world-name app -o app.component.wasm', 'jco wit app.component.wasm', 'advanced WIT architecture', 'must not be installed automatically']
    }
  ];
  for (const route of routeChecks) {
    for (const file of route.files) {
      assert.ok(fs.existsSync(path.join(root, route.root, file)), `${route.id} missing ${file}`);
    }
    const readme = read(path.join(route.root, 'README.md'));
    for (const term of route.readmeTerms) assertIncludes(readme, term, `${route.id} README`);
  }

  const tinygo = JSON.parse(inspectProject(path.join(root, 'skills/wasm-build/examples/tinygo-minimal')));
  assert.deepEqual(tinygo.languages, ['go', 'tinygo']);
  assert.ok(tinygo.toolchainHints.includes('tinygo'));
  assert.deepEqual(tinygo.buildFiles, ['Makefile']);

  const jsComponent = JSON.parse(inspectProject(path.join(root, 'skills/wasm-build/examples/js-component-minimal')));
  assert.deepEqual(jsComponent.languages, ['javascript']);
  assert.deepEqual(jsComponent.witFiles, ['wit/world.wit']);
  assert.deepEqual(jsComponent.runtimeConfigs, [{ type: 'component', path: 'component.json' }]);
  assert.ok(jsComponent.packageScripts.some((item) => item.name === 'build:component'));
}

function validateIntegrationEvidence() {
  const fieldOrder = ['schemaVersion', 'routeId', 'planSummary', 'authorizationBasis', 'prerequisiteState', 'commandsRun', 'buildResult', 'validationResult', 'artifactsProduced', 'generatedOutputPolicy', 'remainingGaps'];
  const allowedRoutes = new Set(['rust-browser', 'tinygo-wasi', 'js-component']);
  const allowedPrereq = new Set(['available', 'missing', 'approved-installed', 'blocked']);
  const allowedBuild = new Set(['passed', 'failed', 'not-run']);
  const allowedValidation = new Set(['passed', 'failed', 'skipped', 'not-run']);
  const evidenceFiles = [
    'skills/wasm-build/evals/fixtures/rust-browser-evidence.json',
    'skills/wasm-build/evals/fixtures/tinygo-wasi-evidence.json',
    'skills/wasm-build/evals/fixtures/js-component-evidence.json'
  ];
  const records = evidenceFiles.map((file) => ({ file, record: readJson(file) }));
  for (const { file, record } of records) {
    assert.deepEqual(Object.keys(record), fieldOrder, `${file} field order mismatch`);
    assert.equal(record.schemaVersion, '1.0', `${file} schemaVersion mismatch`);
    assert.ok(allowedRoutes.has(record.routeId), `${file} unsupported routeId`);
    assert.ok(allowedPrereq.has(record.prerequisiteState), `${file} unsupported prerequisiteState`);
    assert.ok(allowedBuild.has(record.buildResult), `${file} unsupported buildResult`);
    assert.ok(allowedValidation.has(record.validationResult), `${file} unsupported validationResult`);
    assert.ok(Array.isArray(record.commandsRun), `${file} commandsRun must be array`);
    assert.ok(Array.isArray(record.artifactsProduced), `${file} artifactsProduced must be array`);
    assert.ok(Array.isArray(record.remainingGaps), `${file} remainingGaps must be array`);
    assert.ok(isSorted(record.artifactsProduced), `${file} artifactsProduced not sorted`);
    assert.ok(isSorted(record.remainingGaps), `${file} remainingGaps not sorted`);
    if (record.buildResult === 'passed') {
      assert.ok(record.commandsRun.length > 0, `${file} passed build requires commandsRun`);
      assert.equal(record.validationResult, 'passed', `${file} passed build must include passed validation`);
      assert.ok(record.artifactsProduced.length > 0, `${file} passed build requires artifactsProduced`);
    }
  }
  assert.ok(records.some(({ record }) => record.buildResult === 'passed' && record.validationResult === 'passed'), 'at least one route must have real build and validation evidence');
  assert.ok(records.some(({ record }) => record.prerequisiteState === 'missing' && record.buildResult === 'not-run'), 'missing prerequisites must not be route success');

  const prereq = readJson('skills/wasm-build/evals/fixtures/missing-prerequisite-approval.json');
  assert.equal(prereq.schemaVersion, '1.0');
  assert.equal(prereq.approvalRequired, true);
  assert.equal(prereq.approvalStatus, 'requested');
  assert.equal(prereq.resumeStatus, 'blocked');
  assert.ok(['environment', 'global-toolchain', 'system'].includes(prereq.mutationScope));

  const baseline = readJson('skills/wasm-build/evals/fixtures/integration-baseline.json');
  assert.equal(baseline.schemaVersion, '1.0');
  assert.ok(baseline.validationCommands.every((item) => item.status === 'passed'), 'baseline validation commands must pass');
  assert.ok(baseline.startingStateGaps.some((item) => item.routeId === 'tinygo-wasi'));
  assert.ok(baseline.startingStateGaps.some((item) => item.routeId === 'js-component'));
}

function validateGeneratedOutputAbsence() {
  for (const route of ['rust-browser', 'tinygo-minimal', 'js-component-minimal']) {
    const routeRoot = path.join(root, 'skills/wasm-build/examples', route);
    for (const generated of ['target', 'pkg', 'dist', 'node_modules', 'tmp']) {
      assert.ok(!fs.existsSync(path.join(routeRoot, generated)), `${route} must not retain generated ${generated}/`);
    }
  }
  assert.ok(!fs.existsSync(path.join(root, 'skills/wasm-build/examples/tinygo-minimal/app.wasm')), 'tinygo app.wasm must not be committed');
  assert.ok(!fs.existsSync(path.join(root, 'skills/wasm-build/examples/js-component-minimal/app.component.wasm')), 'js component artifact must not be committed');
}

function validateFailureDiagnosisContent() {
  const diagnosis = read('skills/wasm-build/references/failure-diagnosis.md');
  for (const required of [
    'missing toolchain',
    'missing target',
    'wrong WASI preview',
    'missing imports',
    'incorrect exports',
    'missing memory export where relevant',
    'wasm-bindgen compatibility problems',
    'Emscripten versus wasi-sdk confusion',
    'WIT/world mismatch',
    'component validation failure',
    'runtime incompatibility',
    'linker failures',
    'target-incompatible native dependencies'
  ]) {
    assertIncludes(diagnosis, `| ${required} |`, 'failure-diagnosis.md');
  }
  for (const field of ['Symptoms', 'Likely causes', 'Inspection steps', 'Recommended next action', 'Unsafe action to avoid']) {
    assertIncludes(diagnosis, field, 'failure-diagnosis.md');
  }
  assertIncludes(diagnosis, 'observable build output, validator output, artifact structure, or repository evidence', 'failure-diagnosis.md');
}

function validateIntentFixtures(triggers, selectedMode = null) {
  assert.ok(Array.isArray(triggers.intentCases), 'intentCases must be an array');
  assert.ok(Array.isArray(triggers.intentNegativeCases), 'intentNegativeCases must be an array');
  const cases = selectedMode
    ? triggers.intentCases.filter((item) => item.mode === selectedMode)
    : triggers.intentCases;
  assert.ok(cases.length > 0, `missing intent cases for ${selectedMode || 'all modes'}`);
  const byMode = new Map();
  for (const item of triggers.intentCases) {
    assert.ok(['PLAN', 'BUILD', 'BUILD_MISSING_PREREQUISITE', 'REPAIR', 'VALIDATE'].includes(item.mode), `unsupported intent mode ${item.mode}`);
    assert.ok(item.id && item.query && Array.isArray(item.must), `invalid intent case ${item.id || '<missing id>'}`);
    assert.ok(item.language && item.environment, `intent case ${item.id} must include language and environment`);
    byMode.set(item.mode, (byMode.get(item.mode) || 0) + 1);
  }
  for (const modeName of ['PLAN', 'BUILD', 'BUILD_MISSING_PREREQUISITE', 'REPAIR', 'VALIDATE']) {
    assert.ok(byMode.get(modeName) > 0, `missing ${modeName} intent case`);
  }

  const requiredByMode = {
    PLAN: ['no-mutation', 'no-build-execution'],
    BUILD: ['build-execution-authorized', 'validate-after-success', 'no-redundant-build-approval'],
    BUILD_MISSING_PREREQUISITE: ['detect-missing-prerequisite', 'no-automatic-environment-install', 'request-environment-approval', 'resume-after-approval'],
    REPAIR: ['project-local-mutation-authorized', 'environment-approval-required'],
    VALIDATE: ['inspect-existing-artifact', 'allowlisted-validation', 'no-rebuild', 'no-artifact-execution']
  };
  for (const [modeName, required] of Object.entries(requiredByMode)) {
    if (selectedMode && selectedMode !== modeName) continue;
    const modeCases = triggers.intentCases.filter((item) => item.mode === modeName);
    const capabilities = new Set(modeCases.flatMap((item) => item.must));
    for (const capability of required) {
      assert.ok(capabilities.has(capability), `${modeName} missing ${capability}`);
    }
  }

  const negativeCapabilities = new Set(triggers.intentNegativeCases.flatMap((item) => item.mustNot || []));
  for (const capability of [
    'build-execution-authorized',
    'tool-install-authorized',
    'automatic-rust-target-install',
    'automatic-system-package-install'
  ]) {
    assert.ok(negativeCapabilities.has(capability), `intent negative cases missing ${capability}`);
  }

  const positiveActivation = triggers.shouldActivate.map((item) => `${item.id} ${item.query}`.toLowerCase()).join('\n');
  for (const term of ['rust', 'wasi', 'component', 'tinygo', 'c ', 'emscripten', 'javascript', 'artifact', 'spin', 'extism']) {
    assertIncludes(positiveActivation, term, 'trigger-queries.json shouldActivate');
  }
  const intentLanguages = new Set(triggers.intentCases.map((item) => item.language));
  const tier1FamiliesCovered = ['rust', 'tinygo', 'c', 'cpp', 'javascript'].filter((language) => intentLanguages.has(language));
  assert.ok(tier1FamiliesCovered.length >= 4, 'intent cases must cover at least 4 Tier-1 language/toolchain families');
  const intentEnvironments = new Set(triggers.intentCases.map((item) => item.environment));
  for (const environment of ['browser', 'wasi-preview1', 'component-model']) {
    assert.ok(intentEnvironments.has(environment), `intent cases missing ${environment}`);
  }
  assert.ok(intentEnvironments.has('unknown'), 'intent cases must cover ambiguous target selection');
}

async function validateIntentMode(selectedMode) {
  const triggers = JSON.parse(read('skills/wasm-build/evals/trigger-queries.json'));
  assert.equal(triggers.schemaVersion, '1.0');
  validateIntentFixtures(triggers, selectedMode);
}

async function validateInstall() {
  await withTempDir(async (tmp) => {
    const repo = path.join(tmp, 'repo');
    const project = path.join(tmp, 'external-project');
    await copyRecursive(root, repo);
    const env = { ...process.env, HOME: path.join(tmp, 'home') };
    await fsp.mkdir(project);
    const projectPhysicalPath = fs.realpathSync(project);
    const runInstall = (args, cwd = repo) => spawnSync(path.join(repo, 'install.sh'), args, { cwd, env, encoding: 'utf8' });

    let result = runInstall(['wasm-build', '--project'], project);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(project, '.agents/skills/wasm-build/SKILL.md')));
    assert.ok(!fs.existsSync(path.join(repo, '.agents/skills/wasm-build/SKILL.md')));
    assert.match(result.stdout, new RegExp(`Installed wasm-build to ${projectPhysicalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\.agents/skills/wasm-build`));

    result = runInstall(['wasm-build', '--project'], project);
    assert.equal(result.status, 3, result.stderr);

    result = runInstall(['wasm-build', '--project', '--force'], project);
    assert.equal(result.status, 0, result.stderr);

    result = runInstall(['rust-build', '--project'], project);
    assert.equal(result.status, 2);

    result = runInstall(['wasm-build'], project);
    assert.equal(result.status, 2);

    result = runInstall(['wasm-build', '--global']);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(env.HOME, '.agents/skills/wasm-build/SKILL.md')));

    result = runInstall(['wasm-build', '--uninstall', '--project'], project);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(project, '.agents/skills')));
    assert.ok(!fs.existsSync(path.join(project, '.agents/skills/wasm-build')));

    result = runInstall(['wasm-build', '--uninstall', '--project'], project);
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
    assert.equal(artifactReport.artifactForm, 'core-module');
    assert.deepEqual(artifactReport.imports, []);
    assert.deepEqual(artifactReport.exports, []);
    assert.equal(artifactReport.memoryExportPresent, false);
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
    assert.equal(invalidReport.artifactForm, 'invalid');
    assert.equal(invalidReport.memoryExportPresent, null);
    assert.ok(invalidReport.warnings.some((warning) => warning.code === 'invalid-magic'));
  });

  await withTempDir(async (tmp) => {
    const structural = path.join(tmp, 'structural.wasm');
    await fsp.writeFile(structural, structuralCoreWasmBytes());
    const result = run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', structural], { env: { ...process.env, PATH: path.join(tmp, 'missing-tools') } });
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.artifactForm, 'core-module');
    assert.deepEqual(report.imports, ['env.host:function']);
    assert.deepEqual(report.exports, ['memory:memory:0', 'run:function:1']);
    assert.equal(report.memoryExportPresent, true);

    const component = path.join(tmp, 'component.wasm');
    await fsp.writeFile(component, componentHeaderBytes());
    const componentResult = run(process.execPath, ['skills/wasm-build/scripts/inspect-wasm-artifact.mjs', component], { env: { ...process.env, PATH: path.join(tmp, 'missing-tools') } });
    assert.equal(componentResult.status, 0, componentResult.stderr);
    const componentReport = JSON.parse(componentResult.stdout);
    assert.equal(componentReport.artifactForm, 'component');
    assert.equal(componentReport.memoryExportPresent, null);
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
    await writeFakeTool(bin, 'wasm-tools', '/usr/bin/head -c 70000 /dev/zero | /usr/bin/tr "\\0" x; exit 0');
    await writeFakeTool(bin, 'wasm-objdump', '/usr/bin/head -c 70000 /dev/zero | /usr/bin/tr "\\0" y >&2; exit 1');
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
  if (selected === 'intent-plan') return validateIntentMode('PLAN');
  if (selected === 'intent-build') return validateIntentMode('BUILD');
  if (selected === 'intent-build-missing-prerequisite') return validateIntentMode('BUILD_MISSING_PREREQUISITE');
  if (selected === 'intent-repair') return validateIntentMode('REPAIR');
  if (selected === 'intent-validate') return validateIntentMode('VALIDATE');
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
