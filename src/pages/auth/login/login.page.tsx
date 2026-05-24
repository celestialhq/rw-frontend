import { Badge, Box, Center, Divider, Group, Image, Stack, Text, Title } from '@mantine/core'
import { GetStatusCommand } from '@remnawave/backend-contract'
import { useEffect, useMemo, useRef, useState } from 'react'

import { OAuth2LoginButtonsFeature } from '@features/auth/oauth2-login-button/oauth2-login-button.feature'
import { PasskeyLoginButtonFeature } from '@features/auth/passkey-login-button'
import { useCloudflareAccessLogin } from '@shared/api/hooks/auth/auth.hooks'
import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { RegisterFormFeature } from '@features/auth/register-form'
import { LoginFormFeature } from '@features/auth/login-form'
import { parseColoredTextUtil } from '@shared/utils/misc'
import { useAuth } from '@shared/hooks/use-auth'
import { Logo, Page } from '@shared/ui'

type TAuthStatusAuthentication =
    NonNullable<GetStatusCommand.Response['response']['authentication']> & {
        cloudflareAccess?: {
            enabled: boolean
        }
    }

type TAuthStatusWithCloudflareAccess = GetStatusCommand.Response['response'] & {
    authentication: null | TAuthStatusAuthentication
}

const getAuthMethods = (authStatus: GetStatusCommand.Response['response'] | undefined) => {
    const authStatusWithCloudflareAccess = authStatus as TAuthStatusWithCloudflareAccess | undefined

    const isPasswordEnabled = authStatus?.authentication?.password?.enabled ?? false
    const isPasskeyEnabled = authStatus?.authentication?.passkey?.enabled ?? false
    const isCloudflareAccessEnabled =
        authStatusWithCloudflareAccess?.authentication?.cloudflareAccess?.enabled ?? false
    const isOAuth2Enabled =
        Object.values(authStatus?.authentication?.oauth2?.providers ?? {}).some(Boolean) ?? false

    return {
        isCloudflareAccessEnabled,
        isOAuth2Enabled,
        isPasskeyEnabled,
        isPasswordEnabled,
        hasAlternativeMethods: isPasskeyEnabled || isOAuth2Enabled,
        hasPrimaryMethods: isPasswordEnabled
    }
}

const BrandLogo = ({ logoUrl }: { logoUrl?: null | string }) => {
    if (!logoUrl) {
        return <Logo c="cyan" w="3rem" />
    }

    return (
        <Image
            alt="logo"
            fit="contain"
            src={logoUrl}
            style={{
                maxWidth: '40px',
                maxHeight: '40px',
                width: '40px',
                height: '40px'
            }}
        />
    )
}

const BrandTitle = ({ titleParts }: { titleParts: Array<{ color: string; text: string }> }) => {
    return (
        <Title ff="Unbounded" order={1} pos="relative">
            {titleParts.map((part, index) => (
                <Text
                    c={part.color || 'white'}
                    component="span"
                    fw="inherit"
                    fz="inherit"
                    inherit
                    key={index}
                    pos="relative"
                >
                    {part.text}
                </Text>
            ))}
        </Title>
    )
}

const AlternativeAuthMethods = ({
    authentication,
    isOAuth2Enabled,
    isPasskeyEnabled,
    isPasswordEnabled
}: {
    authentication: GetStatusCommand.Response['response']['authentication']
    isOAuth2Enabled: boolean
    isPasskeyEnabled: boolean
    isPasswordEnabled: boolean
}) => (
    <Center>
        <Stack gap="md" maw={isPasswordEnabled ? 300 : 150} w="100%">
            {isPasskeyEnabled && authentication && (
                <PasskeyLoginButtonFeature authentication={authentication} />
            )}
            {isOAuth2Enabled && authentication && (
                <OAuth2LoginButtonsFeature authentication={authentication} />
            )}
        </Stack>
    </Center>
)

export const LoginPage = () => {
    const { data: authStatus } = useGetAuthStatus()
    const { setIsAuthenticated } = useAuth()
    const isCloudflareAccessAttemptedRef = useRef(false)
    const [isCloudflareAccessFailed, setIsCloudflareAccessFailed] = useState(false)

    const titleParts = useMemo(() => {
        if (authStatus?.branding.title) {
            return parseColoredTextUtil(authStatus.branding.title)
        }

        return [
            { text: 'Remna', color: 'cyan' },
            { text: 'wave', color: 'white' }
        ]
    }, [authStatus])

    const isRegister = !authStatus?.isLoginAllowed && authStatus?.isRegisterAllowed
    const authMethods = getAuthMethods(authStatus)

    const { mutate: cloudflareAccessLogin, isPending: isCloudflareAccessPending } =
        useCloudflareAccessLogin({
            mutationFns: {
                onSuccess() {
                    setIsAuthenticated(true)
                },
                onError() {
                    setIsCloudflareAccessFailed(true)
                }
            }
        })

    useEffect(() => {
        if (
            !authStatus?.isLoginAllowed ||
            !authMethods.isCloudflareAccessEnabled ||
            isCloudflareAccessAttemptedRef.current
        ) {
            return
        }

        isCloudflareAccessAttemptedRef.current = true
        setIsCloudflareAccessFailed(false)
        cloudflareAccessLogin({ variables: {} })
    }, [authStatus?.isLoginAllowed, authMethods.isCloudflareAccessEnabled, cloudflareAccessLogin])

    return (
        <Page title="Login">
            <Stack align="center" gap="xs">
                <Group align="center" gap={4} justify="center">
                    <BrandLogo logoUrl={authStatus?.branding.logoUrl} />
                    <BrandTitle titleParts={titleParts} />
                </Group>

                {!authStatus && (
                    <Badge color="cyan" mt={10} size="lg" variant="filled">
                        Server is not responding. Check logs.
                    </Badge>
                )}

                {isCloudflareAccessPending && (
                    <Badge color="orange" mt={10} size="lg" variant="light">
                        Authenticating with Cloudflare Access...
                    </Badge>
                )}

                {isCloudflareAccessFailed && (
                    <Badge color="red" mt={10} size="lg" variant="light">
                        Cloudflare Access authentication failed.
                    </Badge>
                )}

                {!isRegister && authStatus && authStatus.authentication && (
                    <Box maw={800} p={30} w={{ base: 440, sm: 500, md: 500 }}>
                        <Stack gap="lg">
                            {authMethods.isPasswordEnabled && <LoginFormFeature />}

                            {authMethods.hasPrimaryMethods && authMethods.hasAlternativeMethods && (
                                <Center>
                                    <Divider
                                        label="OR"
                                        labelPosition="center"
                                        maw="400px"
                                        w="100%"
                                    />
                                </Center>
                            )}

                            {authMethods.hasAlternativeMethods && (
                                <AlternativeAuthMethods
                                    authentication={authStatus.authentication}
                                    isOAuth2Enabled={authMethods.isOAuth2Enabled}
                                    isPasskeyEnabled={authMethods.isPasskeyEnabled}
                                    isPasswordEnabled={authMethods.isPasswordEnabled}
                                />
                            )}
                        </Stack>
                    </Box>
                )}

                {isRegister && (
                    <Box maw={800} w={{ base: 440, sm: 500, md: 500 }}>
                        <RegisterFormFeature />
                    </Box>
                )}
            </Stack>
        </Page>
    )
}

export default LoginPage
