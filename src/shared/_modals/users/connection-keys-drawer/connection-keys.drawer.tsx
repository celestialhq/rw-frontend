import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    ActionIcon,
    Badge,
    Center,
    CopyButton,
    Drawer,
    Group,
    Stack,
    TextInput,
    ThemeIcon,
    Text
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'
import {
    PiEyeSlashDuotone,
    PiWifiHighDuotone,
    PiLinkBreakDuotone,
    PiProhibitDuotone,
    PiCheck,
    PiCopy,
    PiEmptyDuotone,
    PiQrCodeDuotone
} from 'react-icons/pi'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetConnectionKeysByUuid } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { QrCodeBuilder } from '@shared/ui/qr-code-builder'
import { SectionCardRoot } from '@shared/ui/section-card/section-card.root'
import { SectionCardSection } from '@shared/ui/section-card/section-card.section'

interface IProps {
    userUuid: string
}

export const ConnectionKeysDrawer = NiceModal.create((props: IProps) => {
    const { userUuid } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { data: connectionKeys, isLoading } = useGetConnectionKeysByUuid({
        route: {
            uuid: userUuid
        }
    })

    const renderQrCode = (link: string, remark: string) => {
        modals.open({
            centered: true,
            size: 'auto',
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={PiQrCodeDuotone}
                    iconVariant="soft"
                    title={remark}
                />
            ),
            children: <QrCodeBuilder data={link} title={remark} />
        })
    }

    const renderLinkItem = (link: string) => {
        const encodedName = link.split('#').at(-1) || 'Host'
        const name = decodeURIComponent(encodedName)

        return (
            <TextInput
                key={link}
                label={name}
                leftSection={
                    <CopyButton timeout={2000} value={link}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                onClick={copy}
                                variant="subtle"
                            >
                                {copied ? <PiCheck size="16px" /> : <PiCopy size="16px" />}
                            </ActionIcon>
                        )}
                    </CopyButton>
                }
                readOnly
                rightSection={
                    <ActionIcon onClick={() => renderQrCode(link, name)} variant="subtle">
                        <PiQrCodeDuotone size="16px" />
                    </ActionIcon>
                }
                value={link}
            />
        )
    }

    const renderSection = (keys: string[], label: string, icon: React.ReactNode, color: string) => {
        if (!keys.length) return null

        return (
            <SectionCardRoot gap="sm">
                <SectionCardSection>
                    <Group gap="xs">
                        <ThemeIcon color={color} size="sm" variant="light">
                            {icon}
                        </ThemeIcon>
                        <Text c={color} fw={500} size="sm">
                            {label}
                        </Text>
                        <Badge color={color} size="sm" variant="light">
                            {keys.length}
                        </Badge>
                    </Group>
                </SectionCardSection>
                {keys.map(renderLinkItem)}
            </SectionCardRoot>
        )
    }

    const renderLinks = () => {
        const hasNoKeys =
            !connectionKeys?.enabledKeys.length &&
            !connectionKeys?.disabledKeys.length &&
            !connectionKeys?.hiddenKeys.length

        if (hasNoKeys) {
            return (
                <Center py="xl">
                    <Stack align="center" gap="xs">
                        <PiEmptyDuotone color="var(--mantine-color-gray-5)" size="3rem" />
                        <Text c="dimmed" size="sm">
                            {t(
                                'get-user-subscription-links.feature.no-available-hosts-found-for-this-user'
                            )}
                        </Text>
                    </Stack>
                </Center>
            )
        }

        return (
            <Stack gap="md">
                {renderSection(
                    connectionKeys?.enabledKeys ?? [],
                    'Active',
                    <PiWifiHighDuotone />,
                    'teal'
                )}

                {renderSection(
                    connectionKeys?.hiddenKeys ?? [],
                    'Hidden',
                    <PiEyeSlashDuotone />,
                    'gray'
                )}
                {renderSection(
                    connectionKeys?.disabledKeys ?? [],
                    'Disabled',
                    <PiProhibitDuotone />,
                    'orange'
                )}
            </Stack>
        )
    }

    return (
        <Drawer
            {...modalProps}
            padding="lg"
            position="right"
            size="md"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={PiLinkBreakDuotone}
                    iconVariant="soft"
                    title={t('get-user-subscription-links.feature.connection-keys')}
                />
            }
        >
            {isLoading ? (
                <LoaderModalShared
                    text={t('get-user-subscription-links.feature.loading-subscription-links')}
                />
            ) : (
                <Stack>{renderLinks()}</Stack>
            )}
        </Drawer>
    )
})
