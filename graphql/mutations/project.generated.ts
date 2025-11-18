import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetcher } from '../../lib/fetcher';
export type CreateProjectMutationVariables = Types.Exact<{
  data: Types.ProjectInput;
}>;

export type CreateProjectMutation = {
  __typename?: 'Mutation';
  createProject?: {
    __typename?: 'Project';
    documentId: string;
    permit_no: string;
    year: string;
    layout_no: string;
    town?: string | null;
    project_type: Types.Enum_Project_Project_Type;
    const_start_date?: any | null;
    const_end_date?: any | null;
    rest_start_date?: any | null;
    rest_end_date?: any | null;
    lat?: string | null;
    lng?: string | null;
    address?: string | null;
    project_status?: Types.Enum_Project_Project_Status | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    publishedAt?: any | null;
    permit_close_out?: boolean | null;
  } | null;
};

export type UpdateProjectMutationVariables = Types.Exact<{
  documentId: Types.Scalars['ID']['input'];
  data: Types.ProjectInput;
}>;

export type UpdateProjectMutation = {
  __typename?: 'Mutation';
  updateProject?: {
    __typename?: 'Project';
    documentId: string;
    permit_no: string;
    year: string;
    layout_no: string;
    town?: string | null;
    project_type: Types.Enum_Project_Project_Type;
    project_status?: Types.Enum_Project_Project_Status | null;
    const_start_date?: any | null;
    const_end_date?: any | null;
    rest_start_date?: any | null;
    rest_end_date?: any | null;
    lat?: string | null;
    lng?: string | null;
    address?: string | null;
    permit_close_out?: boolean | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    publishedAt?: any | null;
  } | null;
};

export const CreateProjectDocument = `
    mutation CreateProject($data: ProjectInput!) {
  createProject(data: $data) {
    documentId
    permit_no
    year
    layout_no
    town
    project_type
    const_start_date
    const_end_date
    rest_start_date
    rest_end_date
    lat
    lng
    address
    project_status
    createdAt
    updatedAt
    publishedAt
    permit_close_out
  }
}
    `;

export const useCreateProjectMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateProjectMutation,
    TError,
    CreateProjectMutationVariables,
    TContext
  >
) => {
  return useMutation<CreateProjectMutation, TError, CreateProjectMutationVariables, TContext>({
    mutationKey: ['CreateProject'],
    mutationFn: (variables?: CreateProjectMutationVariables) =>
      fetcher<CreateProjectMutation, CreateProjectMutationVariables>(
        CreateProjectDocument,
        variables
      )(),
    ...options,
  });
};

export const UpdateProjectDocument = `
    mutation UpdateProject($documentId: ID!, $data: ProjectInput!) {
  updateProject(documentId: $documentId, data: $data) {
    documentId
    permit_no
    year
    layout_no
    town
    project_type
    project_status
    const_start_date
    const_end_date
    rest_start_date
    rest_end_date
    lat
    lng
    address
    permit_close_out
    createdAt
    updatedAt
    publishedAt
  }
}
    `;

export const useUpdateProjectMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateProjectMutation,
    TError,
    UpdateProjectMutationVariables,
    TContext
  >
) => {
  return useMutation<UpdateProjectMutation, TError, UpdateProjectMutationVariables, TContext>({
    mutationKey: ['UpdateProject'],
    mutationFn: (variables?: UpdateProjectMutationVariables) =>
      fetcher<UpdateProjectMutation, UpdateProjectMutationVariables>(
        UpdateProjectDocument,
        variables
      )(),
    ...options,
  });
};
