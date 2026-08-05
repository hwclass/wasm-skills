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

function runTool(tool, args) {
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
        name: tool,
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
  const header = await fs.readFile(artifact).then((buffer) => buffer.subarray(0, 8));
  const magic = header.subarray(0, 4).toString('hex');
  const wasmHeaderValid = magic === '0061736d';

  const validation = [];
  validation.push(await runTool('file', [artifact]));
  validation.push(await runTool('wasm-tools', ['validate', artifact]));
  validation.push(await runTool('wasm-objdump', ['-x', artifact]));
  validation.push(await runTool('jco', ['wit', artifact]));
  validation.push(emptyResult('wasmtime', 'skipped', 'Inspection mode does not execute artifacts'));

  const availableTools = Object.fromEntries(validation.map((item) => [item.name, item.status !== 'skipped']));
  const result = {
    schemaVersion: '1.0',
    artifact,
    bytes: stat.size,
    magic,
    wasmHeaderValid,
    availableTools,
    validation,
    imports: [],
    exports: [],
    warnings: wasmHeaderValid ? [] : [{ code: 'invalid-magic', message: 'File does not start with WebAssembly magic bytes' }]
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
