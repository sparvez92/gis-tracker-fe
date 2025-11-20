import { useAuthStore } from "@/store/useAuthStore";

// lib/strapi-fetch.ts
const STRAPI_ENDPOINT = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_GRAPHQL_ENDPOINT = `${STRAPI_ENDPOINT}/graphql`;

  export async function uploadProjectsCsv(file: File) {
  const token = useAuthStore.getState().token;

  const formData = new FormData();
  formData.append("files", file);

  const res = await fetch(`${STRAPI_ENDPOINT}/api/dashboard/upload-csv`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Upload failed");
  }

  return res.json();
}

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
      const token = useAuthStore.getState().token
      console.log('fetching', query, variables);
      const res = await fetch(STRAPI_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token != null && token !== ''
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({ query, variables }),
        signal: options?.signal,
      });
      const responseBody = await res.json();

      if(responseBody.errors && responseBody.errors.length > 0) {
        throw responseBody.errors[0]
      }

      return responseBody?.data || responseBody
    } catch (e) {
      throw e;
    }
  };
}
