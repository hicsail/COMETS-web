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

export type GetSimulationRequestQueryVariables = Types.Exact<{
  request: Types.Scalars['ID']['input'];
}>;


export type GetSimulationRequestQuery = { __typename?: 'Query', getSimulationRequest: { __typename?: 'SimulationRequest', _id: string, email: string, status: Types.SimulationStatus, metaboliteParams: { __typename?: 'MetaboliteParameters', type: Types.MetaboliteType, amount: number }, modelParams: Array<{ __typename?: 'ModelParameters', name: Types.ModelName, neutralDrift: boolean, neutralDriftAmp: number, deathRate: number, linearDiffusivity: number, nonlinearDiffusivity: number }>, globalParams: { __typename?: 'GlobalParameters', timeStep: number, logFreq: number, defaultDiffConst: number, defaultVMax: number, defaultKm: number, maxCycles: number }, result?: { __typename?: 'SimulationResult', requestID: string, biomass: Array<{ __typename?: 'ResultOutput', key: string, name: string, location: string }>, flux: Array<{ __typename?: 'FluxOutput', modelID: string, modelName: string, flux: Array<{ __typename?: 'ResultOutput', key: string, name: string, location: string }> }>, metabolite: Array<{ __typename?: 'ResultOutput', key: string, name: string, location: string }>, biomassSeries: { __typename?: 'ResultOutput', key: string, name: string, location: string }, metaboliteSeries: { __typename?: 'ResultOutput', key: string, name: string, location: string } } | null } };


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
export const GetSimulationRequestDocument = gql`
    query getSimulationRequest($request: ID!) {
  getSimulationRequest(request: $request) {
    _id
    email
    metaboliteParams {
      type
      amount
    }
    modelParams {
      name
      neutralDrift
      neutralDriftAmp
      deathRate
      linearDiffusivity
      nonlinearDiffusivity
    }
    globalParams {
      timeStep
      logFreq
      defaultDiffConst
      defaultVMax
      defaultKm
      maxCycles
    }
    status
    result {
      requestID
      biomass {
        key
        name
        location
      }
      flux {
        modelID
        modelName
        flux {
          key
          name
          location
        }
      }
      metabolite {
        key
        name
        location
      }
      biomassSeries {
        key
        name
        location
      }
      metaboliteSeries {
        key
        name
        location
      }
    }
  }
}
    `;

/**
 * __useGetSimulationRequestQuery__
 *
 * To run a query within a React component, call `useGetSimulationRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSimulationRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSimulationRequestQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useGetSimulationRequestQuery(baseOptions: Apollo.QueryHookOptions<GetSimulationRequestQuery, GetSimulationRequestQueryVariables> & ({ variables: GetSimulationRequestQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSimulationRequestQuery, GetSimulationRequestQueryVariables>(GetSimulationRequestDocument, options);
      }
export function useGetSimulationRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSimulationRequestQuery, GetSimulationRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSimulationRequestQuery, GetSimulationRequestQueryVariables>(GetSimulationRequestDocument, options);
        }
export function useGetSimulationRequestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSimulationRequestQuery, GetSimulationRequestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSimulationRequestQuery, GetSimulationRequestQueryVariables>(GetSimulationRequestDocument, options);
        }
export type GetSimulationRequestQueryHookResult = ReturnType<typeof useGetSimulationRequestQuery>;
export type GetSimulationRequestLazyQueryHookResult = ReturnType<typeof useGetSimulationRequestLazyQuery>;
export type GetSimulationRequestSuspenseQueryHookResult = ReturnType<typeof useGetSimulationRequestSuspenseQuery>;
export type GetSimulationRequestQueryResult = Apollo.QueryResult<GetSimulationRequestQuery, GetSimulationRequestQueryVariables>;