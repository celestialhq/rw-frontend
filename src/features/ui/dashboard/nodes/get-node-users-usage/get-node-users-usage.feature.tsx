import { ActionIcon, Tooltip } from '@mantine/core'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { PiChartBarDuotone } from 'react-icons/pi'

import { showModal } from '@shared/_modals/show-modal'

import { IProps } from './interfaces'

const GetNodeUsersUsageFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    return (
        <Tooltip label={t('get-user-usage.feature.show-usage')}>
            <ActionIcon
                color="indigo"
                onClick={() => {
                    showModal('nodes_nodeUsageStatsDrawer', {
                        nodeUuid
                    })
                }}
                size="lg"
                variant="soft"
            >
                <PiChartBarDuotone size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}

export const GetNodeUsersUsageFeature = memo(GetNodeUsersUsageFeatureComponent)
