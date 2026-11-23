import type { Meta, StoryObj } from '@storybook/react-vite'
import productImage from './camera.jpg'
import { ThemePanels } from '../../tokens/ThemePanels'
import { Button } from '../Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardImage, CardTitle } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="bg-canvas p-6 font-sans text-fg">
        <ThemePanels>
          <div className="w-full max-w-sm">
            <Story />
          </div>
        </ThemePanels>
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
        <p className="text-heading">128</p>
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
        <p>12 units from Northwind Supply, due Friday.</p>
      </CardContent>
      <CardFooter>
        <Button>Mark received</Button>
        <Button variant="ghost">Dismiss</Button>
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
        <p className="text-heading">$240</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">List item</Button>
      </CardFooter>
    </Card>
  ),
}

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-full">
      <CardContent>
        <p>No open acquisitions.</p>
      </CardContent>
    </Card>
  ),
}
