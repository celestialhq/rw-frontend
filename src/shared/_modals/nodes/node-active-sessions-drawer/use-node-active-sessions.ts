import { FetchUsersIpsResultCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useState } from 'react'

import { useFetchUsersIps, useFetchUsersIpsResult } from '@shared/api/hooks'

export type ActiveSessionUser = NonNullable<
    FetchUsersIpsResultCommand.Response['response']['result']
>['users'][number]

export const useNodeActiveSessions = (nodeUuid: string) => {
    const [jobId, setJobId] = useState<null | string>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isFailed, setIsFailed] = useState(false)

    const { mutate: fetchUsersIps } = useFetchUsersIps({
        route: {
            nodeUuid
        },
        mutationFns: {
            onSuccess: (data) => {
                setJobId(data.jobId)
            }
        }
    })

    const shouldPoll = !!jobId && !isCompleted && !isFailed

    const { data: usersIpsResult } = useFetchUsersIpsResult({
        route: {
            jobId: jobId ?? ''
        },
        rQueryParams: {
            enabled: shouldPoll,
            refetchInterval: shouldPoll ? 1000 : false
        }
    })

    useEffect(() => {
        if (!usersIpsResult) return undefined
        if (
            usersIpsResult.isFailed ||
            (usersIpsResult.isCompleted && !usersIpsResult.result?.success)
        ) {
            // oxlint-disable-next-line
            setIsFailed(true)
            return undefined
        }
        if (usersIpsResult.isCompleted) {
            const timer = setTimeout(() => setIsCompleted(true), 500)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [usersIpsResult])

    const refresh = useCallback(() => {
        setJobId(null)
        setIsCompleted(false)
        setIsFailed(false)
        fetchUsersIps({})
    }, [fetchUsersIps])

    useEffect(() => {
        fetchUsersIps({})
    }, [])

    return {
        isCompleted,
        isFailed,
        refresh,
        users: usersIpsResult?.result?.users
    }
}
