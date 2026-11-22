import type { Meta, StoryObj } from '@storybook/react-vite'
import productImage from './card-product.jpg'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardImage, CardTitle } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      options: {
        dark: { name: 'dark', value: '#09090b' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100vw_-_2rem,24rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>Items ready to list.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[length:clamp(1.5rem,0.375rem+6.25cqi,1.875rem)] leading-none font-semibold tracking-tight">
          128
        </p>
      </CardContent>
    </Card>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Acquisition</CardTitle>
        <CardDescription>Pending supplier receipt.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-300">12 units from Northwind Supply, due Friday.</p>
      </CardContent>
      <CardFooter>
        <button
          type="button"
          className="rounded-md bg-zinc-100 px-3 py-1.5 font-medium text-zinc-950 hover:cursor-pointer"
        >
          Mark received
        </button>
        <button
          type="button"
          className="rounded-md px-3 py-1.5 font-medium text-zinc-300 hover:cursor-pointer"
        >
          Dismiss
        </button>
      </CardFooter>
    </Card>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Card className="w-full">
      <CardImage src={productImage} alt="Polaroid OneStep 2 camera on a white surface" />
      <CardHeader>
        <CardTitle>Polaroid camera</CardTitle>
        <CardDescription>Ready to list. One photo on file.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[length:clamp(1.5rem,0.375rem+6.25cqi,1.875rem)] leading-none font-semibold tracking-tight">
          $240
        </p>
      </CardContent>
      <CardFooter>
        <button
          type="button"
          className="rounded-md w-100 bg-zinc-100 px-3 py-1.5 font-medium text-zinc-950 hover:cursor-pointer"
        >
          List item
        </button>
      </CardFooter>
    </Card>
  ),
}

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-full">
      <CardContent>
        <p className="text-zinc-300">No open acquisitions.</p>
      </CardContent>
    </Card>
  ),
}
