import { useTranslation } from 'react-i18next'

import { NodesBandwidthTableWidget } from '@widgets/dashboard/nodes-bandwidth-table/table'
import { LoadingScreen, Page } from '@shared/ui'

import { IProps } from './interfaces'

export default function NodesBandwidthTablePageComponent(props: IProps) {
    const { t } = useTranslation()
    const { isLoading } = props

    return (
        <Page title={t('constants.nodes-bandwidth-table')}>
            {isLoading ? <LoadingScreen height="60vh" /> : <NodesBandwidthTableWidget />}
        </Page>
    )
}
