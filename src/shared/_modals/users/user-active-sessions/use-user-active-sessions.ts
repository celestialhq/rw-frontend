import { notifications } from '@mantine/notifications'
import { FetchIpsResultCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useDropConnections, useFetchIps, useFetchIpsResult } from '@shared/api/hooks'

export type ActiveSessionNode = NonNullable<
    FetchIpsResultCommand.Response['response']['result']
>['nodes'][number]

export const useUserActiveSessions = (userUuid: string) => {
    const { t } = useTranslation()

    const [jobId, setJobId] = useState<null | string>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isFailed, setIsFailed] = useState(false)

    const { mutate: fetchIps } = useFetchIps({
        route: {
            uuid: userUuid
        },
        mutationFns: {
            onSuccess: (data) => {
                setJobId(data.jobId)
            }
        }
    })

    const { mutate: dropConnections } = useDropConnections({
        mutationFns: {
            onSuccess: () => {
                notifications.show({
                    title: t('common.success'),
                    message: t('common.event-sent'),
                    color: 'teal'
                })
            }
        }
    })

    const shouldPoll = !!jobId && !isCompleted && !isFailed

    const { data: userIpsResult } = useFetchIpsResult({
        route: { jobId: jobId ?? '' },
        rQueryParams: {
            enabled: shouldPoll,
            refetchInterval: shouldPoll ? 1000 : false
        }
    })

    useEffect(() => {
        if (!userIpsResult) return undefined
        if (
            userIpsResult.isFailed ||
            (userIpsResult.isCompleted && !userIpsResult.result?.success)
        ) {
            // oxlint-disable-next-line
            setIsFailed(true)
            return undefined
        }
        if (userIpsResult.isCompleted) {
            const timer = setTimeout(() => setIsCompleted(true), 500)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [userIpsResult])

    const refresh = useCallback(() => {
        setJobId(null)
        setIsCompleted(false)
        setIsFailed(false)
        fetchIps({})
    }, [fetchIps])

    useEffect(() => {
        fetchIps({})
    }, [])

    const dropAll = useCallback(
        () =>
            dropConnections({
                variables: {
                    dropBy: {
                        by: 'userUuids',
                        userUuids: [userUuid]
                    },
                    targetNodes: {
                        target: 'allNodes'
                    }
                }
            }),
        [dropConnections, userUuid]
    )

    const dropNode = useCallback(
        (nodeUuid: string) =>
            dropConnections({
                variables: {
                    dropBy: {
                        by: 'userUuids',
                        userUuids: [userUuid]
                    },
                    targetNodes: {
                        target: 'specificNodes',
                        nodeUuids: [nodeUuid]
                    }
                }
            }),
        [dropConnections, userUuid]
    )

    const dropIp = useCallback(
        (ip: string, nodeUuid: string) =>
            dropConnections({
                variables: {
                    dropBy: {
                        by: 'ipAddresses',
                        ipAddresses: [ip]
                    },
                    targetNodes: {
                        target: 'specificNodes',
                        nodeUuids: [nodeUuid]
                    }
                }
            }),
        [dropConnections]
    )

    return {
        dropAll,
        dropIp,
        dropNode,
        isCompleted,
        isFailed,
        nodes: userIpsResult?.result?.nodes,
        progress: userIpsResult?.progress,
        refresh
    }
}
