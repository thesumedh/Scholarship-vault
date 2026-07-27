const cp = require('child_process');
const fs = require('fs');
const env = fs.readFileSync('.env.preview', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if(parts.length >= 2) acc[parts[0]] = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
  return acc;
}, { ...process.env });
env.MIDNIGHT_NETWORK = 'preview';
const result = cp.spawnSync('node', ['node_modules/vite-node/vite-node.mjs', 'scripts/balance.ts'], { env, encoding: 'utf8' });
fs.writeFileSync('balance2.log', result.stdout + '\n\n' + result.stderr);
console.log('Balance check finished.');
