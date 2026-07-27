const cp = require('child_process');
const fs = require('fs');
const env = fs.readFileSync('.env.preprod', 'utf8').split('\n').reduce((acc, line) => {
    const parts = line.split('=');
    if(parts.length >= 2) acc[parts[0]] = parts.slice(1).join('=').trim();
    return acc;
}, {});
env['MIDNIGHT_NETWORK'] = 'preprod';

const out = fs.openSync('out_preprod.log', 'a');
const err = fs.openSync('err_preprod.log', 'a');

const proc = cp.spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', ['vite-node', 'scripts/balance.ts'], {
    env: { ...process.env, ...env },
    stdio: ['ignore', out, err]
});

proc.on('close', (code) => {
    console.log('Balance check finished with code', code);
});
