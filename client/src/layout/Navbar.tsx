import type { JSX, ReactNode } from "react";
import { NavLink, useMatch } from "react-router";
import { Button, Icon, NavItem, PlusIcon, TopBar } from "../components";

const actionButton: JSX.Element = (
    <Button>
        <Icon><PlusIcon /></Icon>
        List item
    </Button>
)

type RoutedNavItemProps = {
    to: string
    end?: boolean
    children: ReactNode
}

const RoutedNavItem = ({ to, end = false, children }: RoutedNavItemProps) => {
    const match = useMatch({ path: to, end })

    return (
        <NavItem as={NavLink} to={to} end={end} current={match != null}>
            {children}
        </NavItem>
    )
}

export const Navbar = () => {
    return (
        <TopBar wordmark="Reseller Dashboard" label="Primary" actions={actionButton}>
            <RoutedNavItem to="/inventory" end>
                Inventory
            </RoutedNavItem>
            <RoutedNavItem to="/acquisitions">Acquisitions</RoutedNavItem>
            <RoutedNavItem to="/listings">Listings</RoutedNavItem>
        </TopBar>
    )
}
