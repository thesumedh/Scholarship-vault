#!/bin/bash
export PATH="/root/.local/bin:$PATH"
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "/mnt/d/risein/MOON/New folder"
npm install -g vite-node
export MIDNIGHT_NETWORK=preview
export $(cat .env.preview | xargs)
yarn deploy:preview
