import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '../../tokens/ThemePanels'
import { TextField } from './TextField'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  parameters: { layout: 'fullscreen' },
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
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'SKU',
    placeholder: 'CAM-104',
    hint: 'Used on listings and receipts.',
  },
}

export const Focus: Story = {
  args: {
    label: 'SKU',
    defaultValue: 'CAM-104',
    'data-state': 'focus',
  },
}

export const Error: Story = {
  args: {
    label: 'SKU',
    defaultValue: 'CAM',
    error: 'Enter at least 6 characters.',
  },
}

export const Required: Story = {
  args: {
    label: 'SKU',
    placeholder: 'CAM-104',
    hint: 'Used on listings and receipts.',
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'SKU',
    defaultValue: 'CAM-104',
    disabled: true,
  },
}
