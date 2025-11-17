import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetcher } from '../../lib/fetcher';
export type LoginMutationVariables = Types.Exact<{
  input: Types.UsersPermissionsLoginInput;
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: {
    __typename?: 'UsersPermissionsLoginPayload';
    jwt?: string | null;
    user: {
      __typename?: 'UsersPermissionsMe';
      id: string;
      documentId: string;
      username: string;
      confirmed?: boolean | null;
      email?: string | null;
    };
  };
};

export const LoginDocument = `
    mutation Login($input: UsersPermissionsLoginInput!) {
  login(input: $input) {
    user {
      id
      documentId
      username
      confirmed
      email
    }
    jwt
  }
}
    `;

export const useLoginMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>
) => {
  return useMutation<LoginMutation, TError, LoginMutationVariables, TContext>({
    mutationKey: ['Login'],
    mutationFn: (variables?: LoginMutationVariables) =>
      fetcher<LoginMutation, LoginMutationVariables>(LoginDocument, variables)(),
    ...options,
  });
};
