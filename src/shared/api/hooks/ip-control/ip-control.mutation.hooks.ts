import {
    DropConnectionsCommand,
    FetchIpsCommand,
    FetchUsersIpsCommand,
    FetchUsersIpsResultCommand
} from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useFetchIps = createMutationHook({
    endpoint: FetchIpsCommand.TSQ_url,
    routeParamsSchema: FetchIpsCommand.RequestParamSchema,
    responseSchema: FetchIpsCommand.ResponseSchema,
    requestMethod: FetchIpsCommand.endpointDetails.REQUEST_METHOD
})

export const useFetchUsersIps = createMutationHook({
    endpoint: FetchUsersIpsCommand.TSQ_url,
    routeParamsSchema: FetchUsersIpsCommand.RequestParamSchema,
    responseSchema: FetchUsersIpsCommand.ResponseSchema,
    requestMethod: FetchUsersIpsCommand.endpointDetails.REQUEST_METHOD
})

export const useFetchUsersIpsResultMutation = createMutationHook({
    endpoint: FetchUsersIpsResultCommand.TSQ_url,
    responseSchema: FetchUsersIpsResultCommand.ResponseSchema,
    routeParamsSchema: FetchUsersIpsResultCommand.RequestParamSchema,
    requestMethod: FetchUsersIpsResultCommand.endpointDetails.REQUEST_METHOD
})

export const useDropConnections = createMutationHook({
    endpoint: DropConnectionsCommand.TSQ_url,
    bodySchema: DropConnectionsCommand.RequestBodySchema,
    responseSchema: DropConnectionsCommand.ResponseSchema,
    requestMethod: DropConnectionsCommand.endpointDetails.REQUEST_METHOD
})
