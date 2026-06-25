import { createQueryKeys } from '@lukemorales/query-key-factory'
import { GetRemnawaveSettingsCommand } from '@remnawave/backend-contract'
import { z } from 'zod'

import { sToMs } from '@shared/utils/time-utils'

import { CloudflareAccessSettingsSchema } from './remnawave-settings.mutation.hooks'
import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const remnawaveSettingsQueryKeys = createQueryKeys('remnawaveSettings', {
    getRemnawaveSettings: {
        queryKey: null
    }
})

const GetRemnawaveSettingsResponseSchema = GetRemnawaveSettingsCommand.ResponseSchema.extend({
    response: GetRemnawaveSettingsCommand.ResponseSchema.shape.response.extend({
        cloudflareAccessSettings: z.nullable(CloudflareAccessSettingsSchema).default(null)
    })
})

export const useGetRemnawaveSettings = createGetQueryHook({
    endpoint: GetRemnawaveSettingsCommand.TSQ_url,
    responseSchema: GetRemnawaveSettingsResponseSchema,
    getQueryKey: () => remnawaveSettingsQueryKeys.getRemnawaveSettings.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Remnawave Settings')
})
