import type { JSX } from "react";
import { Button, Icon, NavItem, PlusIcon, TopBar } from "../components";

const actionButton: JSX.Element = (
    <Button>
        <Icon><PlusIcon /></Icon>
        List item
    </Button>
)

export const Navbar = () => {
    return (
        <TopBar wordmark="Reseller Dashboard" label="Primary" actions={actionButton}>
            <NavItem href="#inventory" current>
                Inventory
            </NavItem>
            <NavItem href="#acquisitions">Acquisitions</NavItem>
            <NavItem href="#listings">Listings</NavItem>
        </TopBar>
    )
}