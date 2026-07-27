@echo off
for /f "tokens=* delims=" %%x in (.env.preprod) do set "%%x"
set MIDNIGHT_NETWORK=preprod
set NODE_OPTIONS=--max-old-space-size=8192
npx vite-node scripts\deploy.ts
