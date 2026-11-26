import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '@/tokens/ThemePanels'
import { Button } from '@/components/Button'
import { Icon } from './Icon'
import { CheckIcon, PlusIcon, SearchIcon } from './icons'

const meta = {
  title: 'Components/Icon',
  component: Icon,
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
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

const Row = ({ size, name, px }: { size: 'sm' | 'md' | 'lg'; name: string; px: string }) => {
  return (
    <p className="flex items-center gap-2 text-body">
      <Icon size={size}>
        <SearchIcon />
      </Icon>
      <span>
        {name} · {px} · aligns to the center of body text
      </span>
    </p>
  )
}

export const Rules: Story = {
  args: {
    children: <SearchIcon />,
  },
  render: () => (
    <div className="grid max-w-md gap-6">
      <div className="grid gap-3">
        <Row size="sm" name="Small" px="16px" />
        <Row size="md" name="Medium" px="20px" />
        <Row size="lg" name="Large" px="24px" />
      </div>
      <div className="flex items-center gap-4">
        <Icon size="sm" className="text-brand-fg">
          <PlusIcon />
        </Icon>
        <Icon size="md" className="text-success-fg">
          <CheckIcon />
        </Icon>
        <Icon size="lg" className="text-error-fg">
          <SearchIcon />
        </Icon>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button>
          <Icon size="sm">
            <PlusIcon />
          </Icon>
          Add item
        </Button>
        <Button variant="ghost" className="size-9 px-0" aria-label="Search">
          <Icon size="sm">
            <SearchIcon />
          </Icon>
        </Button>
      </div>
      <p className="text-caption max-w-sm text-fg-muted">
        Use small beside labels and inside buttons, medium as the default, and large when the icon stands alone.
        Icons inherit the text color. Decorative icons stay hidden from assistive tech. Give the control a name when
        the icon is the only content.
      </p>
    </div>
  ),
}
