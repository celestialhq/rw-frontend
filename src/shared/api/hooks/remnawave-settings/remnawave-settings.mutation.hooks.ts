import { UpdateRemnawaveSettingsCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { z } from 'zod'

import { createMutationHook } from '../../tsq-helpers'

export const CloudflareAccessSettingsSchema = z.object({
    enabled: z.boolean(),
    teamDomain: z.nullable(z.string()),
    audience: z.nullable(z.string()),
    emailAllowlistEnabled: z.boolean(),
    allowedEmails: z.array(z.string()),
    allowedDomains: z.array(z.string())
})

export type TCloudflareAccessSettings = z.infer<typeof CloudflareAccessSettingsSchema>

export const UpdateRemnawaveSettingsRequestSchema =
    UpdateRemnawaveSettingsCommand.RequestSchema.extend({
        cloudflareAccessSettings: CloudflareAccessSettingsSchema.optional()
    })

const UpdateRemnawaveSettingsResponseSchema = UpdateRemnawaveSettingsCommand.ResponseSchema.extend({
    response: UpdateRemnawaveSettingsCommand.ResponseSchema.shape.response.extend({
        cloudflareAccessSettings: z.nullable(CloudflareAccessSettingsSchema).default(null)
    })
})

export const useUpdateRemnawaveSettings = createMutationHook({
    endpoint: UpdateRemnawaveSettingsCommand.TSQ_url,
    bodySchema: UpdateRemnawaveSettingsRequestSchema,
    responseSchema: UpdateRemnawaveSettingsResponseSchema,
    requestMethod: UpdateRemnawaveSettingsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Remnawave settings updated successfully',
                color: 'teal'
            })
        }
    }
})
