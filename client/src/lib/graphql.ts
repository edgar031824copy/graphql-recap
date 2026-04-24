import { useQuery, useMutation, DocumentNode, OperationVariables, MutationHookOptions } from '@apollo/client';

export function useGQLQuery<TData, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  variables?: TVariables,
) {
  return useQuery<TData, TVariables>(query, { variables });
}

export function useGQLMutation<TData, TVariables extends OperationVariables = OperationVariables>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>,
) {
  return useMutation<TData, TVariables>(mutation, options);
}
