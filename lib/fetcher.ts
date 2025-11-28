import { useAuthStore } from '@/store/useAuthStore';
import { notify } from './utils';
import { ALERT_TYPES, TOKEN_COOKIE } from '@/constants';
import { Project } from '@/types';
import Cookies from "js-cookie"
// lib/strapi-fetch.ts
const STRAPI_ENDPOINT = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_GRAPHQL_ENDPOINT = `${STRAPI_ENDPOINT}/graphql`;

export async function uploadProjectsCsv(file: File) {
  const token = useAuthStore.getState().token || Cookies.get(TOKEN_COOKIE);

  const formData = new FormData();
  formData.append('files', file);

  const res = await fetch(`${STRAPI_ENDPOINT}/api/dashboard/upload-csv`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    console.log('Upload error response:', err);
    const errorMessage = err?.error?.message || 'Something went wrong';

    if (err?.error?.status === 401) {
      notify('Session expired. Please log in again.', ALERT_TYPES.error);

      useAuthStore.getState().logout();

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);

      throw new Error(errorMessage);
    }

    notify(errorMessage, ALERT_TYPES.error);
    throw new Error(errorMessage);
  }
  return res.json();
}

export function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (options?: { signal?: AbortSignal }): Promise<TData> => {
    try {
      const token = useAuthStore.getState().token || Cookies.get(TOKEN_COOKIE);

      const res = await fetch(STRAPI_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token != null && token !== '' ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query, variables }),
        signal: options?.signal,
      });

      const responseBody = await res.json();

      if (responseBody?.error?.status === 401) {
        notify('Session expired. Please log in again.', ALERT_TYPES.error);

        useAuthStore.getState().logout();

        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);

        throw new Error('Unauthorized');
      }

      if (responseBody.errors && responseBody.errors.length > 0) {
        notify(responseBody.errors[0].message || 'Something went wrong', ALERT_TYPES.error);
        throw responseBody.errors[0];
      }

      return responseBody?.data || responseBody;
    } catch (e: any) {
      throw e;
    }
  };
}

export async function downloadPdf(projectInfo: Project) {
  const token = useAuthStore.getState().token || Cookies.get(TOKEN_COOKIE);

  const res = await fetch(`${STRAPI_ENDPOINT}/api/dashboard/generateProjectPDF/${projectInfo?.documentId}`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let errJson;
    try {
      errJson = await res.json();
    } catch {
      throw new Error('Something went wrong while downloading PDF');
    }

    const errorMessage = errJson?.error?.message || 'Something went wrong';

    if (errJson?.error?.status === 401) {
      notify('Session expired. Please log in again.', ALERT_TYPES.error);
      useAuthStore.getState().logout();

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);

      throw new Error(errorMessage);
    }

    notify(errorMessage, ALERT_TYPES.error);
    throw new Error(errorMessage);
  }

  // IMPORTANT: PDF is binary -> read as BLOB
  const blob = await res.blob();

  // Create a temporary download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Project Permit# ${projectInfo.permit_no}.pdf`;
  a.click();

  // Cleanup
  URL.revokeObjectURL(url);

  return true;
}


export async function fetcherRestApi(endPoint: string, query?: string) {
  const token = useAuthStore.getState().token || Cookies.get(TOKEN_COOKIE);

  const res = await fetch(`${STRAPI_ENDPOINT}/api/dashboard/${endPoint}?${query}`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let errJson;
    try {
      errJson = await res.json();
    } catch {
      throw new Error('Something went wrong while downloading PDF');
    }

    const errorMessage = errJson?.error?.message || 'Something went wrong';

    if (errJson?.error?.status === 401) {
      notify('Session expired. Please log in again.', ALERT_TYPES.error);
      useAuthStore.getState().logout();

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);

      throw new Error(errorMessage);
    }

    notify(errorMessage, ALERT_TYPES.error);
    throw new Error(errorMessage);
  }

  const jsonRes =await res.json()

  return jsonRes
}

export const fetchAllProjects = () => {
  return fetcherRestApi('project-by-type')
}

export const fetchProjectByYear = (year: string) => {
  return fetcherRestApi(`count-by-date`, `year=${year}`)
}

export const fetchSummary = () => {
  return fetcherRestApi(`summary`)
}

export const fetchProjectByType = () => {
  return fetcherRestApi(`project-by-type`)
}
