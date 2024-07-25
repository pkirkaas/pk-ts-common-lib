# AI Agent Instructions for detailed TypeScript Code analysis

## Project Goals

The TypeScript code in this repository is a collection of common utility functions and classes that are used in various projects. 

The library is intended to be usable in other projects both as typescript and javascript, and should support both commonjs and es6 modules. However the primary focus is modern typescript and esm modules.


## AI Agent Analysis Goals

The goals of your analysis are to carefully, deeply analyze the source code and document the purpose of each function and class, and to identify any potential issues or areas for improvement.

You should create all your output files in the `groq-output` subdirectory of this Google Drive folder.

Your output should include:

A new version of the `common-operations.ts` file with all the functions and classes fully documented in TSDoc format, including:

- A brief description of the purpose of the function or class
- A list of the parameters and return values of the function or class
- Example usage

Your additional goal is to create structured analysis of the code in a format suitable for custom RAG training of AI agents to advise, understand, and answer questions about the code.

The output should be in JSON format using the  Rasa NLU schema

You should also create an AST parse tree of the code in the most appropriate format for custom RAG training of AI agents to advise, understand, and answer questions about the code.

You should also create a list of all the functions and classes in the code, with their parameters and return values, in a format suitable for custom RAG training of AI agents to advise, understand, and answer questions about the code.

You should also create a file called `NextSteps+Suggestions.md` that includes all your suggestions for what else to do to support RAG data for custom training.

## Primary files to examine

- `/package.json`
- `/tsconfig.json`
- `/src/common-operations.ts`
- `/src/index.ts`
- `/src/object-operations.ts`
- `/src/tag-class.ts`
- `/src/util-classes.ts`
- `/src/axios-init.ts`
- `/src/lib/*.ts`

Examine the `package.json` file to see what dependencies are required.

## Assumptions

- This library will be used in both browser and node.js environments.
- This library will only be used with the most modern, standards compliant browsers and node, with full support for all modern ES6 features.
- The latest versions of all dependency libraries will be used.
- This Common library is used in several other libraries I have created, a node/server library, and browser / front-end library for a web application using react.





