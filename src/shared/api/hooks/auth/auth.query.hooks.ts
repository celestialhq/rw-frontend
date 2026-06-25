import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
    GetPasskeyAuthenticationOptionsCommand,
    GetStatusCommand
} from '@remnawave/backend-contract'
import { keepPreviousData } from '@tanstack/react-query'
import { z } from 'zod'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const authQueryKeys = createQueryKeys('auth', {
    getAuthStatus: {
        queryKey: null
    },
    getPasskeyAuthenticationOptions: {
        queryKey: null
    }
})

const GetStatusResponseSchema = GetStatusCommand.ResponseSchema.extend({
    response: GetStatusCommand.ResponseSchema.shape.response.extend({
        authentication: z.nullable(
            GetStatusCommand.ResponseSchema.shape.response.shape.authentication.unwrap().extend({
                cloudflareAccess: z
                    .object({
                        enabled: z.boolean()
                    })
                    .default({ enabled: false })
            })
        )
    })
})

export const useGetAuthStatus = createGetQueryHook({
    endpoint: GetStatusCommand.TSQ_url,
    responseSchema: GetStatusResponseSchema,
    getQueryKey: () => authQueryKeys.getAuthStatus.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        placeholderData: keepPreviousData
    },
    errorHandler: (error) => errorHandler(error, 'Authentication Error')
})

export const usePasskeyAuthenticationOptions = createGetQueryHook({
    endpoint: GetPasskeyAuthenticationOptionsCommand.TSQ_url,
    responseSchema: GetPasskeyAuthenticationOptionsCommand.ResponseSchema,
    getQueryKey: () => authQueryKeys.getPasskeyAuthenticationOptions.queryKey,
    rQueryParams: {
        enabled: false
    },
    errorHandler: (error) => errorHandler(error, 'Authentication Error')
})
