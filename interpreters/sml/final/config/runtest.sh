#!/bin/sh

TMPDIR="$(mktemp -d)" || exit 1
trap '{ rm -rf $TMPDIR; }' EXIT

$EMCC -O2 -o "$TMPDIR"/tst.js "$@"
$NODE "$TMPDIR/tst.js"

