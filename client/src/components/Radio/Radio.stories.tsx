import { useId } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '../../tokens/ThemePanels'
import { Radio, RadioGroup } from './Radio'

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
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
  args: {
    label: 'Fulfillment',
    name: 'fulfillment',
    children: null,
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const Fulfillment = ({
  error,
  disabled,
  focus,
  required,
}: {
  error?: string
  disabled?: boolean
  focus?: boolean
  required?: boolean
}) => {
  const name = useId()

  return (
    <RadioGroup
      name={name}
      label="Fulfillment"
      hint="How this item leaves inventory."
      error={error}
      required={required}
    >
      <Radio label="Pickup" value="pickup" defaultChecked disabled={disabled} data-state={focus ? 'focus' : undefined} />
      <Radio label="Ship" value="ship" disabled={disabled} />
    </RadioGroup>
  )
}

export const Default: Story = {
  render: () => <Fulfillment />,
}

export const Focus: Story = {
  render: () => <Fulfillment focus />,
}

export const Error: Story = {
  render: () => <Fulfillment error="Choose how this item will be fulfilled." />,
}

export const Required: Story = {
  render: () => <Fulfillment required />,
}

export const Disabled: Story = {
  render: () => <Fulfillment disabled />,
}
