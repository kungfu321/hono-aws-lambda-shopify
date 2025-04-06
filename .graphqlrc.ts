import {ApiType, shopifyApiProject} from '@shopify/api-codegen-preset';

export default {
  schema: 'https://shopify.dev/admin-graphql-direct-proxy',
  documents: ['./app/libs/shopify/*.ts', '!node_modules'],
  projects: {
    default: shopifyApiProject({
      apiType: ApiType.Admin,
      apiVersion: '2025-04',
      outputDir: './app/libs/shopify/types',
    }),
  },
};