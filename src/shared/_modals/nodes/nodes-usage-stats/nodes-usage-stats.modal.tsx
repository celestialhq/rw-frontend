import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Modal } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbChartArcs3 } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { NodesUsageStatsContent } from './nodes-usage-stats.content'

interface IProps {
    nodeUuids: string[]
}

export const NodesUsageStatsModal = NiceModal.create((props: IProps) => {
    const { nodeUuids } = props

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal
    })

    const { t } = useTranslation()

    if (nodeUuids.length === 0) {
        return null
    }

    return (
        <Modal
            {...modalProps}
            size="800px"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbChartArcs3}
                    iconVariant="soft"
                    title={t('node-users-usage-drawer.widget.user-traffic-statistics')}
                />
            }
        >
            <NodesUsageStatsContent nodeUuids={nodeUuids} />
        </Modal>
    )
})
