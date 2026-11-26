import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { ThemePanels } from '@/tokens/ThemePanels'
import { Button, type ButtonVariant } from './Button'
import { Icon, PlusIcon } from '@/components/Icon'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'fullscreen' },
  args: {
    children: 'Save item',
    variant: 'primary',
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
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const buttonVariants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const satisfies readonly ButtonVariant[]

const variantCopy: Record<ButtonVariant, string> = {
  primary: 'Save item',
  secondary: 'Cancel',
  outline: 'Edit listing',
  ghost: 'Dismiss',
  destructive: 'Delete item',
}

const states: Array<{ name: string; props: ComponentProps<typeof Button> }> = [
  { name: 'Default', props: {} },
  { name: 'Hover', props: { 'data-state': 'hover' } },
  { name: 'Active', props: { 'data-state': 'active' } },
  { name: 'Focus', props: { 'data-state': 'focus' } },
  { name: 'Disabled', props: { disabled: true } },
  { name: 'Loading', props: { loading: true } },
]

export const Primary: Story = {
  args: { variant: 'primary', children: variantCopy.primary },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: variantCopy.secondary },
}

export const Outline: Story = {
  args: { variant: 'outline', children: variantCopy.outline },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: variantCopy.ghost },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: variantCopy.destructive },
}

export const States: Story = {
  render: () => (
    <div className="grid gap-6">
      {buttonVariants.map((variant) => (
        <div key={variant} className="grid gap-2">
          <p className="text-label text-fg-muted capitalize">{variant}</p>
          <div className="flex flex-wrap items-center gap-3">
            {states.map((state) => (
              <Button key={state.name} variant={variant} {...state.props}>
                {state.name}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Icon size="sm">
        <PlusIcon />
      </Icon>
      Add item
    </Button>
  ),
}
