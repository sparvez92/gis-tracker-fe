// lib/strapi-fetch.ts
const STRAPI_GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/graphql';

export function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (options?: { signal?: AbortSignal }): Promise<TData> => {
    // await assertFreshTokens();
    // const accessToken = useTokenStore.getState().accessToken;
    // const locale = useAppStore.getState().locale;
    // const userAgent = await getUserAgent();
    // const currentVersion = App.nativeApplicationVersion;
    // let apiUrl = NEXT_PUBLIC_GRAPHQL_URL;

    // if (__DEV__ && Platform.OS === 'android') {
    //   apiUrl = NEXT_PUBLIC_GRAPHQL_URL.replace(
    //     /localhost|127\.0\.0\.1/,
    //     '10.0.2.2'
    //   );
    // }

    try {
      console.log('fetching', query, variables);
      const res = await fetch(STRAPI_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ...(accessToken != null && accessToken !== ''
          //   ? { Authorization: `Bearer ${accessToken}` }
          //   : {}),
        },
        body: JSON.stringify({ query, variables }),
        signal: options?.signal,
      });
      if (!res.ok) {
        throw new Error('networkRequestFailed');
      }
      const responseBody = await res.json();

      // type narrowing to make sure we have the expected json shape
      // { data: Record<string, any> } | { errors: Error[]}
      if (typeof responseBody === 'object' && responseBody != null) {
        // check for error array
        if ('errors' in responseBody && Array.isArray(responseBody.errors)) {
          const { message } = responseBody.errors[0];
          throw new Error(message);
        }
        // check for data object
        if ('data' in responseBody && typeof responseBody.data === 'object') {
          return responseBody.data as TData;
        }
      }

      throw new Error('Invalid response from server');
    } catch (e) {
      throw e;
    }
  };
}
