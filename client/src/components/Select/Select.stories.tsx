import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '@/tokens/ThemePanels'
import { Select } from './Select'

const options = (
  <>
    <option value="new">New</option>
    <option value="used">Used</option>
    <option value="parts">For parts</option>
  </>
)

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'fullscreen' },
  args: {
    label: 'Condition',
    children: options,
  },
  decorators: [
    (Story) => (
      <div className="bg-canvas p-6 font-sans text-fg">
        <ThemePanels>
          <div className="max-w-sm">
            <Story />
          </div>
        </ThemePanels>
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Condition',
    hint: 'Shown on the public listing.',
    defaultValue: 'used',
    children: options,
  },
}

export const Focus: Story = {
  args: {
    label: 'Condition',
    defaultValue: 'used',
    'data-state': 'focus',
    children: options,
  },
}

export const Error: Story = {
  args: {
    label: 'Condition',
    error: 'Choose a condition.',
    children: (
      <>
        <option value="">Select a condition</option>
        <option value="new">New</option>
        <option value="used">Used</option>
        <option value="parts">For parts</option>
      </>
    ),
  },
}

export const Required: Story = {
  args: {
    label: 'Condition',
    hint: 'Shown on the public listing.',
    defaultValue: 'used',
    required: true,
    children: options,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Condition',
    defaultValue: 'used',
    disabled: true,
    children: options,
  },
}
