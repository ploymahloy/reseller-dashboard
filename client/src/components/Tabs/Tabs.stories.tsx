import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '@/tokens/ThemePanels'
import { Tab, TabList, TabPanel, Tabs } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'fullscreen' },
  args: {
    label: 'Listing sections',
    children: null,
  },
  decorators: [
    (Story) => (
      <div className="bg-canvas p-6 font-sans text-fg">
        <ThemePanels>
          <div className="max-w-md">
            <Story />
          </div>
        </ThemePanels>
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Listing: Story = {
  render: () => (
    <Tabs label="Listing sections" defaultValue="details">
      <TabList>
        <Tab value="details">Details</Tab>
        <Tab value="photos">Photos</Tab>
        <Tab value="pricing">Pricing</Tab>
      </TabList>
      <TabPanel value="details">SKU CAM-104. Used, includes the strap.</TabPanel>
      <TabPanel value="photos">One photo on file.</TabPanel>
      <TabPanel value="pricing">Listed at $240.</TabPanel>
    </Tabs>
  ),
}

export const States: Story = {
  render: () => (
    <Tabs label="Listing sections" defaultValue="details">
      <TabList>
        <Tab value="details">Selected</Tab>
        <Tab value="photos" data-state="hover">
          Hover
        </Tab>
        <Tab value="pricing" data-state="focus">
          Focus
        </Tab>
        <Tab value="shipping" data-state="active">
          Active
        </Tab>
      </TabList>
      <TabPanel value="details">Selected panel.</TabPanel>
      <TabPanel value="photos">Hover panel.</TabPanel>
      <TabPanel value="pricing">Focus panel.</TabPanel>
      <TabPanel value="shipping">Active panel.</TabPanel>
    </Tabs>
  ),
}
