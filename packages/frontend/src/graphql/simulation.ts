/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from './graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RequestSimulationMutationVariables = Types.Exact<{
  request: Types.SimulationRequestInput;
}>;


export type RequestSimulationMutation = { __typename?: 'Mutation', requestSimulation: boolean };


export const RequestSimulationDocument = gql`
    mutation requestSimulation($request: SimulationRequestInput!) {
  requestSimulation(request: $request)
}
    `;
export type RequestSimulationMutationFn = Apollo.MutationFunction<RequestSimulationMutation, RequestSimulationMutationVariables>;

/**
 * __useRequestSimulationMutation__
 *
 * To run a mutation, you first call `useRequestSimulationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestSimulationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestSimulationMutation, { data, loading, error }] = useRequestSimulationMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useRequestSimulationMutation(baseOptions?: Apollo.MutationHookOptions<RequestSimulationMutation, RequestSimulationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestSimulationMutation, RequestSimulationMutationVariables>(RequestSimulationDocument, options);
      }
export type RequestSimulationMutationHookResult = ReturnType<typeof useRequestSimulationMutation>;
export type RequestSimulationMutationResult = Apollo.MutationResult<RequestSimulationMutation>;
export type RequestSimulationMutationOptions = Apollo.BaseMutationOptions<RequestSimulationMutation, RequestSimulationMutationVariables>;