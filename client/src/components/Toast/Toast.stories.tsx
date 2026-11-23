import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Toast } from './Toast'

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: { layout: 'fullscreen' },
  args: {
    open: false,
    onDismiss: () => {},
    children: null,
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

const ReceivedToast = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-svh bg-canvas p-6 font-sans text-fg">
      <Button onClick={() => setOpen(true)}>Mark received</Button>
      <Toast open={open} onDismiss={() => setOpen(false)} variant="success" title="Marked received">
        <p>12 units from Northwind Supply.</p>
        <Button variant="ghost" className="mt-3 text-current!" onClick={() => setOpen(false)}>
          Undo
        </Button>
      </Toast>
    </div>
  )
}

export const Received: Story = {
  render: () => <ReceivedToast />,
}

export const Dark: Story = {
  render: () => (
    <div className="dark">
      <ReceivedToast />
    </div>
  ),
}
