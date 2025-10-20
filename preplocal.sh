#! /bin/bash

if ! which "npx" >/dev/null; then
    echo "npx not found."
    exit 1
fi
rm -rf .output

npm run build

