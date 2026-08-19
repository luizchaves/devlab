/// <reference path="../.astro/types.d.ts" />

// Os plugins do Expressive Code adicionam props ao `<Code>` por declaration
// merging. As referencias abaixo garantem que `showLineNumbers`,
// `startLineNumber`, `collapse` etc. existam na tipagem herdada por
// `<SourceCode>`.
/// <reference types="@expressive-code/plugin-line-numbers" />
/// <reference types="@expressive-code/plugin-collapsible-sections" />
