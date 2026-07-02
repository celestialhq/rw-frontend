import {
    useGetConfigProfiles,
    useGetNodePlugins,
    useGetNodes,
    useGetNodesTags,
    useGetPubKey
} from '@shared/api/hooks'

import NodesPageComponent from '../components/nodes.page.component'

export function NodesPageConnector() {
    const { data: nodes, isLoading } = useGetNodes()
    const { isLoading: isConfigProfilesLoading } = useGetConfigProfiles()

    useGetPubKey()
    useGetNodePlugins()
    useGetNodesTags()

    return <NodesPageComponent isLoading={isLoading || isConfigProfilesLoading} nodes={nodes} />
}
