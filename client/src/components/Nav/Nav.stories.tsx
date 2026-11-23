import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '../../tokens/ThemePanels'
import { Button } from '../Button'
import { NavItem, Sidebar, TopBar } from './Nav'

const meta = {
  title: 'Components/Nav',
  component: TopBar,
  parameters: { layout: 'fullscreen' },
  args: {
    wordmark: 'Reseller',
    label: 'Primary',
    children: null,
  },
  decorators: [
    (Story) => (
      <div className="bg-canvas p-6 font-sans text-fg">
        <ThemePanels>
          <Story />
        </ThemePanels>
      </div>
    ),
  ],
} satisfies Meta<typeof TopBar>

export default meta
type Story = StoryObj<typeof meta>

export const Top: Story = {
  render: () => (
    <TopBar wordmark="Reseller" label="Primary" actions={<Button>List item</Button>}>
      <NavItem href="#inventory" current>
        Inventory
      </NavItem>
      <NavItem href="#acquisitions">Acquisitions</NavItem>
      <NavItem href="#listings">Listings</NavItem>
    </TopBar>
  ),
}

export const Side: Story = {
  render: () => (
    <Sidebar label="Primary">
      <NavItem href="#inventory" current>
        Inventory
      </NavItem>
      <NavItem href="#acquisitions">Acquisitions</NavItem>
      <NavItem href="#listings">Listings</NavItem>
    </Sidebar>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <NavItem href="#inventory" current>
        Current
      </NavItem>
      <NavItem href="#acquisitions" data-state="hover">
        Hover
      </NavItem>
      <NavItem href="#listings" data-state="active">
        Active
      </NavItem>
      <NavItem href="#sold" data-state="focus">
        Focus
      </NavItem>
    </div>
  ),
}
