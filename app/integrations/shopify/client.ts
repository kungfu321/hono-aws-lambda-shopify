import { createAdminApiClient } from '@shopify/admin-api-client';

export interface ShopifyAdminClientConfig {
  storeDomain: string;
  accessToken: string;
  apiVersion?: string;
  retries?: number;
}

export function createShopifyAdminClient({
  storeDomain,
  accessToken,
  apiVersion = '2025-04',
  retries = 3,
}: ShopifyAdminClientConfig) {
  const client = createAdminApiClient({
    storeDomain,
    apiVersion,
    accessToken,
    retries,
  });

  async function query<T = any>(
    operation: string,
    options?: { variables?: Record<string, any> }
  ) {
    try {
      const { data, errors, extensions } = await client.request(
        operation,
        { variables: options?.variables }
      );

      if (errors?.graphQLErrors && errors?.graphQLErrors.length > 0) {
        throw new Error(
          `GraphQL errors: ${errors.graphQLErrors.map(e => e.message).join(', ')}`
        );
      }

      return {
        data: data as T,
        extensions
      };
    } catch (error) {
      console.error('Shopify Admin API query error:', error);
      throw error;
    }
  }

  return {
    client,
    query,
  };
}

export const shopifyAdmin = async ({ shop, accessToken }: { shop: string; accessToken: string }) => {
  try {
    return createShopifyAdminClient({
      storeDomain: shop,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(`Error fetching Shopify admin client for shop ${shop}:`, error);
    throw error;
  }
};
