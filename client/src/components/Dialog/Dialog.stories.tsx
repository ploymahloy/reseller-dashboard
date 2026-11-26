import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '@/tokens/ThemePanels'
import { Button } from '@/components/Button'
import { Dialog, DialogBody, DialogClose, DialogDescription, DialogFooter, DialogTitle } from './Dialog'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'fullscreen' },
  args: {
    open: false,
    onClose: () => {},
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
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const ListItemDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>List item</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="flex items-start gap-3 p-4">
          <div className="grid min-w-0 flex-1 gap-1">
            <DialogTitle>List item</DialogTitle>
            <DialogDescription>Publish this Polaroid camera to the shop.</DialogDescription>
          </div>
          <DialogClose />
        </div>
        <DialogBody>
          <p>Polaroid OneStep 2, used, $240.</p>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>List</Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export const ListItem: Story = {
  render: () => <ListItemDialog />,
}
