import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '../../tokens/ThemePanels'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
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
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Include the original strap' },
  render: (args) => (
    <div className="grid gap-3">
      <Checkbox {...args} />
      <Checkbox label="Item has been inspected" defaultChecked />
    </div>
  ),
}

export const Focus: Story = {
  args: { label: 'Include the original strap', 'data-state': 'focus' },
}

export const Error: Story = {
  args: {
    label: 'Item has been inspected',
    error: 'Confirm the item was inspected before listing.',
  },
}

export const Required: Story = {
  args: {
    label: 'Item has been inspected',
    hint: 'Required before listing.',
    required: true,
  },
}

export const Disabled: Story = {
  args: { label: 'Include the original strap', disabled: true },
  render: (args) => (
    <div className="grid gap-3">
      <Checkbox {...args} />
      <Checkbox label="Item has been inspected" defaultChecked disabled />
    </div>
  ),
}
