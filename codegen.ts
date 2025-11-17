import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  
  schema: 'http://localhost:1337/graphql',
  documents: 'graphql/**/*.graphql',
  hooks: {
    afterAllFileWrite: ['prettier --write'],  
  },
  generates: {
    "types.ts": {
      plugins: ["typescript"]
    },
    "./graphql": {
      preset: "near-operation-file",
      presetConfig: {
        baseTypesPath: "../types.ts",
      },
      plugins: ["typescript-operations", "typescript-react-query"],
      config: {
        reactQueryVersion: 5,
        fetcher: {
          func: '../../lib/fetcher#fetcher',
// 🚨 CRITICAL FIX: Use a lambda function to explicitly define 
          // the 'mutationFn' signature (which only takes variables)
          // This tells Codegen: "The final function to execute is this arrow function."
          // The wrapper calls your curried fetcher correctly: fetcher(doc, vars)()
          formatter: "({document, variables}) => (data) => fetcher(document, data)()",
        }
      }
    },
    // 'src/gql/graphql.ts': {
    //   plugins: ['typescript', 'typescript-operations'],
    //   config: {
    //     useIndexSignature: true,
    //     documentMode: 'external',
    //     importDocumentNodeExternallyFrom: '../../lib/strapi-fetch',
    //   },
    // },

    // 'src/gql/': {
    //   preset: 'near-operation-file',
    //   presetConfig: {
    //     extension: '.generated.tsx',
    //     baseDir: 'graphql',
    //     baseTypesPath: '../src/gql/graphql',
    //   },
    //   plugins: ['typescript-react-query'],
    //   config: {
    //     fetcher: {
    //       func: 'strapiGqlFetch',
    //       is: '../../lib/strapi-fetch',
    //     },
    //     addSuffix: 'Hook',
    //     errorType: 'Error',
    //     exposeStatus: true,
    //   },
    // },
  },
  overwrite: true,
};

export default config;
