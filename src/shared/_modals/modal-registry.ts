import type { ComponentProps } from 'react'

import NiceModal from '@ebay/nice-modal-react'

import { InternalSquadsInboundsDrawer } from './internal-squads'
import {
    DetailedUserInfoDrawer,
    ViewUserModal,
    UserAccessibleNodesModal,
    CreateUserModal,
    UserUsageModal,
    UserTorrentBlockerReportsModal,
    SubscriptionQrCodeModal,
    ConnectionKeysDrawer,
    UserSubscriptionRequestsModal,
    UserHwidDevicesModal,
    UserActiveSessionDrawer
} from './users'

export const MODAL_REGISTRY = {
    users_viewUserModal: ViewUserModal,
    users_detailedUserInfoDrawer: DetailedUserInfoDrawer,
    users_userAccessibleNodesModal: UserAccessibleNodesModal,
    users_createUserModal: CreateUserModal,
    users_userUsageModal: UserUsageModal,
    users_userTorrentBlockerReportsModal: UserTorrentBlockerReportsModal,
    users_connectionKeysDrawer: ConnectionKeysDrawer,
    users_subscriptionQrCodeModal: SubscriptionQrCodeModal,
    users_userSubscriptionRequestsModal: UserSubscriptionRequestsModal,
    users_userHwidDevicesModal: UserHwidDevicesModal,
    users_userActiveSessionDrawer: UserActiveSessionDrawer,

    internalSquads_internalSquadsInboundsDrawer: InternalSquadsInboundsDrawer
} as const

Object.entries(MODAL_REGISTRY).forEach(([id, Cmp]) => NiceModal.register(id, Cmp))

type Registry = typeof MODAL_REGISTRY
export type ModalId = keyof Registry

export type ModalArgs<K extends ModalId> = Omit<ComponentProps<Registry[K]>, 'id' | 'keepMounted'>
