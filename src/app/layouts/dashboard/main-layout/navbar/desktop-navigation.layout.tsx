import { Link, matchPath, useLocation } from 'react-router'
import { Button, Group, Menu } from '@mantine/core'
import { PiCaretDownBold } from 'react-icons/pi'
import { ElementType, Fragment } from 'react'
import clsx from 'clsx'

import { useDesktopMenuSections } from '../menu-sections/desktop-menu-sections'
import classes from './desktop-navigation.module.css'

const NavIcon = ({ icon: Icon }: { icon?: ElementType }) =>
    Icon ? (
        <span className={classes.icon}>
            <Icon />
        </span>
    ) : null

const isPathActive = (pathname: string, href: string): boolean =>
    matchPath({ path: href, end: false }, pathname) !== null

const externalLinkProps = (newTab?: boolean) =>
    newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

export const DesktopNavigation = () => {
    const { pathname } = useLocation()
    const menu = useDesktopMenuSections()

    return (
        <Group align="stretch" className={classes.navBar} gap={4} wrap="nowrap">
            {menu.map((section) => {
                const sectionActive = section.section.some((item) => {
                    if (item.newTab) {
                        return false
                    }
                    const hrefs = [
                        item.href,
                        ...(item.dropdownItems?.map((child) => child.href) ?? [])
                    ]
                    return hrefs.some((href) => isPathActive(pathname, href))
                })

                const singleItem =
                    section.section.length === 1 &&
                    !section.section[0].dropdownItems &&
                    !section.section[0].newTab
                        ? section.section[0]
                        : null

                if (singleItem) {
                    return (
                        <Button
                            className={clsx(classes.navItem, {
                                [classes.navItemActive]: sectionActive
                            })}
                            component={Link}
                            key={section.id}
                            leftSection={<NavIcon icon={section.icon ?? singleItem.icon} />}
                            to={singleItem.href}
                            variant="subtle"
                        >
                            {section.header}
                        </Button>
                    )
                }

                return (
                    <Menu
                        closeDelay={120}
                        key={section.id}
                        openDelay={50}
                        position="bottom-start"
                        trigger="click-hover"
                        width={250}
                        withinPortal
                    >
                        <Menu.Target>
                            <Button
                                className={clsx(classes.navItem, {
                                    [classes.navItemActive]: sectionActive
                                })}
                                leftSection={<NavIcon icon={section.icon} />}
                                rightSection={
                                    <PiCaretDownBold className={classes.caret} size={11} />
                                }
                                variant="subtle"
                            >
                                {section.header}
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {section.section.map((item, index) =>
                                item.dropdownItems ? (
                                    <Fragment key={item.id}>
                                        {index > 0 && <Menu.Divider />}
                                        <Menu.Label>{item.name}</Menu.Label>
                                        {item.dropdownItems.map((dropdownItem) => (
                                            <Menu.Item
                                                className={clsx({
                                                    [classes.menuItemActive]: isPathActive(
                                                        pathname,
                                                        dropdownItem.href
                                                    )
                                                })}
                                                component={Link}
                                                key={dropdownItem.id}
                                                leftSection={<NavIcon icon={dropdownItem.icon} />}
                                                to={dropdownItem.href}
                                            >
                                                {dropdownItem.name}
                                            </Menu.Item>
                                        ))}
                                        {index < section.section.length - 1 && <Menu.Divider />}
                                    </Fragment>
                                ) : (
                                    <Menu.Item
                                        className={clsx({
                                            [classes.menuItemActive]:
                                                !item.newTab && isPathActive(pathname, item.href)
                                        })}
                                        component={Link}
                                        key={item.id}
                                        leftSection={<NavIcon icon={item.icon} />}
                                        to={item.href}
                                        {...externalLinkProps(item.newTab)}
                                    >
                                        {item.name}
                                    </Menu.Item>
                                )
                            )}
                        </Menu.Dropdown>
                    </Menu>
                )
            })}
        </Group>
    )
}
