#!/usr/bin/env bash
# Every line tagged @expect-error must fail to compile. Guards the type-state
# narrowing: without this, the .spec files only prove that valid code compiles.
set -uo pipefail
file="type-tests/must-not-compile.ts"
expected=$(grep -c "@expect-error" "$file")
out=$(npx tsc --noEmit --strict --skipLibCheck --target es2020 --moduleResolution node "$file" 2>&1 | sed 's/\x1b\[[0-9;]*m//g')
lines=$(grep -oE "must-not-compile\.ts\(([0-9]+)," <<<"$out" | grep -oE "[0-9]+" | sort -u)
found=0
for l in $lines; do
  prev=$((l - 1))
  if sed -n "${prev}p" "$file" | grep -q "@expect-error"; then found=$((found + 1)); fi
done
echo "expected type errors: $expected | confirmed: $found"
[ "$expected" -eq "$found" ]
