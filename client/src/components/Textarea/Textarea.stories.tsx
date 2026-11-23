import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '../../tokens/ThemePanels'
import { Textarea } from './Textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
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
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Condition, inclusions, flaws.',
    hint: 'Shown to buyers on the listing.',
  },
}

export const Focus: Story = {
  args: {
    label: 'Notes',
    defaultValue: 'Light wear on the corner. Includes the strap.',
    'data-state': 'focus',
  },
}

export const Error: Story = {
  args: {
    label: 'Notes',
    defaultValue: 'Worn.',
    error: 'Add enough detail to describe the item.',
  },
}

export const Required: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Condition, inclusions, flaws.',
    hint: 'Shown to buyers on the listing.',
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Notes',
    defaultValue: 'Light wear on the corner. Includes the strap.',
    disabled: true,
  },
}
