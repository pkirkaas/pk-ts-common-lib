# Generate complete, detailed function documentation in TSDoc syntax

## Task

The TypeScript code in the file `./src/common-operations.ts` is very poorly and sparsely commented.

Your task is to deeply & completely analyze and understand all of the code in this file, its purpose, and how it should be used.

After understanding all the code and functions, you should create thorough, detailed, complete TSDoc comments for each exported function.

The code already contains some TSDoc style comments, which may be helpful to you & others. We don't want to remove these existing comments. Instead just ADD your generated TSDoc comments between the original TSDoc comment (if any), and before the actual function definition. To distinguish the TSDoc comments you create, add an `@aider` tag at the start of every doc comment you generate.

## TSDoc requirements for exported functions

- overloaded functions - many functions have multiple, overloaded signatures. The generated TSDoc should detail each overloaded signature.

- function parameters: Each parameter comment should contain the parameter name, type(s), optional & default, and description of its purpose.

- function return types, conditions, and description: A function can return different values/types depending on conditions. Define each possible return type, and what it is used for.

- Detailed discussion/description of the purpose and usage of the function 


