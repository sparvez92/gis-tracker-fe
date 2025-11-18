import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetcher } from '../../lib/fetcher';
export type ProjectsQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.ProjectFiltersInput>;
  pagination?: Types.InputMaybe<Types.PaginationArg>;
  sort?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['String']['input']>>
    | Types.InputMaybe<Types.Scalars['String']['input']>
  >;
}>;

export type ProjectsQuery = {
  __typename?: 'Query';
  projects: Array<{
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
    permit_close_out?: boolean | null;
  } | null>;
};

export type GetSingleProjectQueryVariables = Types.Exact<{
  documentId: Types.Scalars['ID']['input'];
}>;

export type GetSingleProjectQuery = {
  __typename?: 'Query';
  project?: {
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
    createdAt?: any | null;
    updatedAt?: any | null;
    publishedAt?: any | null;
    permit_close_out?: boolean | null;
  } | null;
};

export const ProjectsDocument = `
    query Projects($filters: ProjectFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  projects(filters: $filters, pagination: $pagination, sort: $sort) {
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
    permit_close_out
  }
}
    `;

export const useProjectsQuery = <TData = ProjectsQuery, TError = unknown>(
  variables?: ProjectsQueryVariables,
  options?: Omit<UseQueryOptions<ProjectsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<ProjectsQuery, TError, TData>['queryKey'];
  }
) => {
  return useQuery<ProjectsQuery, TError, TData>({
    queryKey: variables === undefined ? ['Projects'] : ['Projects', variables],
    queryFn: fetcher<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, variables),
    ...options,
  });
};

export const GetSingleProjectDocument = `
    query GetSingleProject($documentId: ID!) {
  project(documentId: $documentId) {
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
    createdAt
    updatedAt
    publishedAt
    permit_close_out
  }
}
    `;

export const useGetSingleProjectQuery = <TData = GetSingleProjectQuery, TError = unknown>(
  variables: GetSingleProjectQueryVariables,
  options?: Omit<UseQueryOptions<GetSingleProjectQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetSingleProjectQuery, TError, TData>['queryKey'];
  }
) => {
  return useQuery<GetSingleProjectQuery, TError, TData>({
    queryKey: ['GetSingleProject', variables],
    queryFn: fetcher<GetSingleProjectQuery, GetSingleProjectQueryVariables>(
      GetSingleProjectDocument,
      variables
    ),
    ...options,
  });
};
