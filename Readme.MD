# PK Library of common TS/JS utility library for both backend (node) & frontend (react, etc)

## 1 Feb 2023 Copyright 2023 - Paul Kirkaas - pkirkaas@gmail.com

## Background

I've developed and collaborated on a lot of huge, complex JavaScript/TypeScript projects, front-end & back-end, and did a lot of copying & pasting useful functions/utilities from one to the next - which is tedious, time consuming, messy, and impossible to maintain.

So I made a reusable library (set of libraries) for myself. It's not remotely clean or production ready - I focus on experimenting, trying new techniques, getting functionality I want, and clean/fix as I go along. I'm happy if anyone has input or wants to contribute.

I'm trying to support all implementations - TypeScript, CommonJS, & ESM. But TypeScript w. ESM is what I work with & test most.





Includes - common env independent functionality
common contains environment independent features, that are included included in both client & node libraries, which have additional env functionality

TODO - combine JSON5 & json-decycle cleverly!


CLEANER tsconfig.x.json approach:

Use ESM as default - export that as tsconfig.json

Make a CJS tsconfig.cjs.json, extending tsconfige & overriding for cjs

Eliminate tsconfig.common.json, tsconfig.esm.json, tsconfig.base.json

So, only 2 tsconfig files: tsconfig.json & tsconfig.cjs.json

EXPORT them in package.json