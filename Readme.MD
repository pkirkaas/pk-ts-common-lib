1 Feb 2023
Copyright 2023 - Paul Kirkaas - pkirkaas@gmail.com

#PK Library of common TS/JS features for both backend (node) & frontend (react, etc)

Includes - common env independent functionality
common contains environment independent features, that are included included in both client & node libraries, which have additional env functionality

TODO - combine JSON5 & json-decycle cleverly!


CLEANER tsconfig.x.json approach:

Use ESM as default - export that as tsconfig.json

Make a CJS tsconfig.cjs.json, extending tsconfige & overriding for cjs

Eliminate tsconfig.common.json, tsconfig.esm.json, tsconfig.base.json

So, only 2 tsconfig files: tsconfig.json & tsconfig.cjs.json

EXPORT them in package.json