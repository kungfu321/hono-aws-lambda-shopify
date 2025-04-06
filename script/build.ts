import * as esbuild from 'esbuild';
import * as path from 'path';
import * as fs from 'fs';

// Define the modules to build
const modules = ['users'];

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Build each module
for (const module of modules) {
  const entryPoint = path.join(__dirname, '..', 'app', 'modules', module, 'index.ts');
  const outfile = path.join(buildDir, `${module}.mjs`);

  esbuild.buildSync({
    entryPoints: [entryPoint],
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node22',
    format: 'esm',
    outfile,
    external: ['aws-sdk', '@aws-sdk/*'],
  });

  console.log(`Built ${module} lambda function at ${outfile}`);
}

console.log('All lambda functions built successfully!');