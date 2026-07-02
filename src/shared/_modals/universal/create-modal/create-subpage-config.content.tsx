import { Stack, TextInput, Group, Button } from '@mantine/core'
import { useField } from '@mantine/form'
import { CreateSubscriptionPageConfigCommand } from '@remnawave/backend-contract'
import { t } from 'i18next'
import { generatePath, NavigateFunction } from 'react-router'

import { queryClient } from '@shared/api'
import { useCreateSubscriptionPageConfig } from '@shared/api/hooks'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { ROUTES } from '@shared/constants'

interface IProps {
    onClose: () => void
    navigate: NavigateFunction
}

export const CreateSubpageConfigContent = (props: IProps) => {
    const { onClose, navigate } = props

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.subpageConfigs.getSubscriptionPageConfigs.queryKey
        })
    }

    const nameField = useField<CreateSubscriptionPageConfigCommand.Request['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateSubscriptionPageConfigCommand.RequestSchema.safeParse({
                name: value
            })
            return result.success ? null : result.error.errors[0]?.message
        }
    })

    const { mutate: createSubscriptionPageConfig, isPending } = useCreateSubscriptionPageConfig({
        mutationFns: {
            onSuccess: (data) => {
                onClose()
                handleUpdate()
                navigate(
                    generatePath(ROUTES.DASHBOARD.SUBPAGE_CONFIGS.SUBPAGE_CONFIG_BY_UUID, {
                        uuid: data.uuid
                    })
                )
            }
        }
    })
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                createSubscriptionPageConfig({
                    variables: {
                        name: nameField.getValue()
                    }
                })
            }}
        >
            <Stack gap="md">
                <TextInput
                    data-autofocus
                    label={t('common.name')}
                    placeholder="My Subscription Page Config"
                    required
                    {...nameField.getInputProps()}
                />
                <Group justify="flex-end">
                    <Button color="gray" onClick={close} variant="light">
                        {t('common.cancel')}
                    </Button>

                    <Button color="teal" loading={isPending} type="submit">
                        {t('common.create')}
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
