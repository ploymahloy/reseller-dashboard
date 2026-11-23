import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '../../tokens/ThemePanels'
import { Button } from '../Button'
import { Alert, type AlertVariant } from './Alert'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Acquisition updated',
    children: '12 units from Northwind Supply are due Friday.',
    variant: 'info',
  },
  decorators: [
    (Story) => (
      <div className="bg-canvas p-6 font-sans text-fg">
        <ThemePanels>
          <div className="grid max-w-md gap-3">
            <Story />
          </div>
        </ThemePanels>
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

const variants = ['neutral', 'success', 'warning', 'error', 'info'] as const satisfies readonly AlertVariant[]

const copy: Record<AlertVariant, { title: string; body: string }> = {
  neutral: { title: 'Draft saved', body: 'This listing is not public yet.' },
  success: { title: 'Marked received', body: '12 units from Northwind Supply.' },
  warning: { title: 'Price missing', body: 'Add a price before publishing.' },
  error: { title: 'Listing failed', body: 'The shop rejected this item.' },
  info: { title: 'Shipment update', body: 'Pickup is scheduled for Friday.' },
}

export const Statuses: Story = {
  render: () => (
    <>
      {variants.map((variant) => (
        <Alert key={variant} variant={variant} title={copy[variant].title}>
          {copy[variant].body}
        </Alert>
      ))}
    </>
  ),
}

const DismissibleAlert = () => {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return (
      <Button variant="ghost" onClick={() => setVisible(true)}>
        Show banner
      </Button>
    )
  }

  return (
    <Alert variant="error" title="Listing failed" onDismiss={() => setVisible(false)}>
      Add a price before publishing.
    </Alert>
  )
}

export const Dismissible: Story = {
  render: () => <DismissibleAlert />,
}
