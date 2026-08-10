#!/usr/bin/env node
import { spawn } from 'child_process';
import fsModule from 'fs';
import path from 'path';

const fs = fsModule.promises;

const TIMEOUT_MS = 5000;
const OUTPUT_LIMIT = 64 * 1024;
const ALLOWLIST = new Set(['wasm-tools', 'wasmtime', 'wasm-objdump', 'jco', 'file']);
const artifactArg = process.argv[2];

function emptyResult(tool, status, summary) {
  return {
    name: tool,
    available: status !== 'skipped',
    status,
    exitCode: null,
    timedOut: false,
    stdout: '',
    stderr: '',
    summary
  };
}

function capBuffer(current, chunk) {
  const combined = Buffer.concat([current, Buffer.from(chunk)]);
  return combined.length > OUTPUT_LIMIT ? combined.subarray(0, OUTPUT_LIMIT) : combined;
}

function runTool(tool, args, name = tool) {
  if (!ALLOWLIST.has(tool)) throw new Error(`Tool is not allowlisted: ${tool}`);
  return new Promise((resolve) => {
    const child = spawn(tool, args, {
      shell: false,
      env: {
        PATH: process.env.PATH || '',
        HOME: process.env.HOME || '',
        TMPDIR: process.env.TMPDIR || '',
        LANG: process.env.LANG || '',
        LC_ALL: process.env.LC_ALL || ''
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = Buffer.alloc(0);
    let stderr = Buffer.alloc(0);
    let settled = false;
    const timer = setTimeout(() => {
      settled = true;
      child.kill('SIGTERM');
      resolve({
        name: tool,
        available: true,
        status: 'timeout',
        exitCode: null,
        timedOut: true,
        stdout: stdout.toString(),
        stderr: stderr.toString(),
        summary: 'Command timed out'
      });
    }, TIMEOUT_MS);
    child.stdout.on('data', (chunk) => {
      stdout = capBuffer(stdout, chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderr = capBuffer(stderr, chunk);
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      if (settled) return;
      if (error.code === 'ENOENT') {
        resolve(emptyResult(tool, 'skipped', 'Tool not found'));
      } else {
        resolve({ ...emptyResult(tool, 'error', error.message), available: true });
      }
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (settled) return;
      const out = stdout.toString();
      const err = stderr.toString();
      resolve({
        name,
        available: true,
        status: code === 0 ? 'valid' : 'invalid',
        exitCode: code,
        timedOut: false,
        stdout: out,
        stderr: err,
        summary: code === 0 ? 'Validation command accepted artifact' : 'Validation command rejected artifact'
      });
    });
  });
}

class WasmReader {
  constructor(buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }

  eof() {
    return this.offset >= this.buffer.length;
  }

  readByte() {
    if (this.offset >= this.buffer.length) throw new Error('Unexpected end of file');
    return this.buffer[this.offset++];
  }

  readBytes(length) {
    if (this.offset + length > this.buffer.length) throw new Error('Unexpected end of file');
    const bytes = this.buffer.subarray(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }

  readVarUint32() {
    let result = 0;
    let shift = 0;
    for (let index = 0; index < 5; index++) {
      const byte = this.readByte();
      result |= (byte & 0x7f) << shift;
      if ((byte & 0x80) === 0) return result >>> 0;
      shift += 7;
    }
    throw new Error('Invalid LEB128 value');
  }

  readString() {
    const length = this.readVarUint32();
    return this.readBytes(length).toString('utf8');
  }

  skipLimits() {
    const flags = this.readByte();
    this.readVarUint32();
    if (flags & 0x01) this.readVarUint32();
  }

  skipValueType() {
    this.readByte();
  }

  skipBlockType() {
    this.readByte();
  }
}

function kindName(kind) {
  return ['function', 'table', 'memory', 'global'][kind] || `kind-${kind}`;
}

function skipImportDescriptor(reader) {
  const kind = reader.readByte();
  if (kind === 0) {
    reader.readVarUint32();
  } else if (kind === 1) {
    reader.readByte();
    reader.skipLimits();
  } else if (kind === 2) {
    reader.skipLimits();
  } else if (kind === 3) {
    reader.skipValueType();
    reader.readByte();
  } else {
    throw new Error(`Unsupported import kind ${kind}`);
  }
  return kind;
}

function parseImportSection(payload) {
  const reader = new WasmReader(payload);
  const count = reader.readVarUint32();
  const imports = [];
  for (let index = 0; index < count; index++) {
    const moduleName = reader.readString();
    const fieldName = reader.readString();
    const kind = skipImportDescriptor(reader);
    imports.push(`${moduleName}.${fieldName}:${kindName(kind)}`);
  }
  return imports;
}

function parseExportSection(payload) {
  const reader = new WasmReader(payload);
  const count = reader.readVarUint32();
  const exports = [];
  for (let index = 0; index < count; index++) {
    const exportName = reader.readString();
    const kind = reader.readByte();
    const itemIndex = reader.readVarUint32();
    exports.push(`${exportName}:${kindName(kind)}:${itemIndex}`);
  }
  return exports;
}

function parseCoreStructure(buffer) {
  const reader = new WasmReader(buffer.subarray(8));
  const imports = [];
  const exports = [];
  let parseWarning = null;
  try {
    while (!reader.eof()) {
      const sectionId = reader.readByte();
      const size = reader.readVarUint32();
      const payload = reader.readBytes(size);
      if (sectionId === 2) imports.push(...parseImportSection(payload));
      if (sectionId === 7) exports.push(...parseExportSection(payload));
    }
  } catch (error) {
    parseWarning = { code: 'structure-parse-incomplete', message: error.message };
  }
  const sortedExports = [...new Set(exports)].sort();
  return {
    imports: [...new Set(imports)].sort(),
    exports: sortedExports,
    memoryExportPresent: sortedExports.some((item) => item.includes(':memory:')),
    parseWarning
  };
}

function parseComponentWit(text) {
  const imports = [];
  const exports = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    const importMatch = line.match(/^import\s+([^;]+);$/);
    if (importMatch) imports.push(importMatch[1].trim());
    const exportMatch = line.match(/^export\s+([^;]+);$/);
    if (exportMatch) exports.push(exportMatch[1].trim());
  }
  return {
    imports: [...new Set(imports)].sort(),
    exports: [...new Set(exports)].sort()
  };
}

function classifyArtifact(header) {
  const magic = header.subarray(0, 4).toString('hex');
  const version = header.subarray(4, 8).toString('hex');
  if (magic !== '0061736d') return 'invalid';
  if (version === '01000000') return 'core-module';
  if (version === '0d000100') return 'component';
  return 'unknown';
}

if (!artifactArg || !artifactArg.endsWith('.wasm')) {
  console.error('Expected a .wasm artifact path');
  process.exit(2);
}

try {
  const artifact = path.resolve(artifactArg);
  const stat = await fs.lstat(artifact);
  if (!stat.isFile() || stat.isSymbolicLink()) {
    console.error(`Artifact must be a regular .wasm file: ${artifactArg}`);
    process.exit(2);
  }
  const buffer = await fs.readFile(artifact);
  const header = buffer.subarray(0, 8);
  const magic = header.subarray(0, 4).toString('hex');
  const wasmHeaderValid = magic === '0061736d';
  const artifactForm = classifyArtifact(header);

  const validation = [];
  validation.push(await runTool('file', [artifact]));
  validation.push(await runTool('wasm-tools', ['validate', artifact]));
  if (artifactForm === 'component') {
    validation.push(await runTool('wasm-tools', ['component', 'wit', artifact], 'wasm-tools component wit'));
  }
  validation.push(await runTool('wasm-objdump', ['-x', artifact]));
  validation.push(await runTool('jco', ['wit', artifact]));
  validation.push(emptyResult('wasmtime', 'skipped', 'Inspection mode does not execute artifacts'));

  const warnings = wasmHeaderValid ? [] : [{ code: 'invalid-magic', message: 'File does not start with WebAssembly magic bytes' }];
  let imports = [];
  let exports = [];
  let memoryExportPresent = null;
  if (artifactForm === 'core-module') {
    const structure = parseCoreStructure(buffer);
    imports = structure.imports;
    exports = structure.exports;
    memoryExportPresent = structure.memoryExportPresent;
    if (structure.parseWarning) warnings.push(structure.parseWarning);
  } else if (artifactForm === 'component') {
    const wit = validation.find((item) => item.name === 'wasm-tools component wit' && item.status === 'valid');
    if (wit) {
      const structure = parseComponentWit(wit.stdout);
      imports = structure.imports;
      exports = structure.exports;
    }
  }

  const availableTools = Object.fromEntries(validation.map((item) => [item.name, item.status !== 'skipped']));
  const result = {
    schemaVersion: '1.0',
    artifact,
    bytes: stat.size,
    magic,
    wasmHeaderValid,
    artifactForm,
    availableTools,
    validation,
    imports,
    exports,
    memoryExportPresent,
    warnings: warnings.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`Artifact not found: ${artifactArg}`);
    process.exit(2);
  }
  if (error.code === 'EACCES') {
    console.error(`Artifact cannot be read: ${artifactArg}`);
    process.exit(4);
  }
  console.error(error.message);
  process.exit(1);
}
