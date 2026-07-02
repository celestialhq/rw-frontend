import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbTrash } from 'react-icons/tb'

import { hideModal } from '@shared/_modals/show-modal'
import { useDeleteHost } from '@shared/api/hooks'

interface IProps {
    hostUuid: string
}

export function DeleteHostFeature(props: IProps) {
    const { hostUuid } = props

    const { t } = useTranslation()

    const { mutate: deleteHost, isPending: isDeleteHostPending } = useDeleteHost({
        mutationFns: {
            onSuccess: () => {
                hideModal('hosts_editHostDrawer')
            }
        }
    })

    const handleDeleteHost = async () => {
        deleteHost({ route: { uuid: hostUuid } })
    }

    return (
        <Tooltip label={t('common.delete')}>
            <ActionIcon
                color="red"
                loading={isDeleteHostPending}
                onClick={handleDeleteHost}
                size="xl"
                variant="light"
            >
                <TbTrash size="24px" />
            </ActionIcon>
        </Tooltip>
    )
}
