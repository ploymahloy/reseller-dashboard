import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '@/tokens/ThemePanels'
import { Switch } from './Switch'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="bg-canvas p-6 font-sans text-fg">
        <ThemePanels>
          <Story />
        </ThemePanels>
      </div>
    ),
  ],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Publish listing' },
  render: (args) => (
    <div className="grid gap-3">
      <Switch {...args} />
      <Switch label="Track quantity" defaultChecked />
    </div>
  ),
}

export const Focus: Story = {
  args: { label: 'Publish listing', 'data-state': 'focus' },
}

export const Error: Story = {
  args: {
    label: 'Publish listing',
    error: 'Turn publishing on to list this item.',
  },
}

export const Required: Story = {
  args: {
    label: 'Publish listing',
    hint: 'Required to make the item public.',
    required: true,
  },
}

export const Disabled: Story = {
  args: { label: 'Publish listing', disabled: true },
  render: (args) => (
    <div className="grid gap-3">
      <Switch {...args} />
      <Switch label="Track quantity" defaultChecked disabled />
    </div>
  ),
}
