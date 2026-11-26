import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '@/tokens/ThemePanels'
import { Badge, type BadgeVariant } from './Badge'

const badgeVariants = ['neutral', 'success', 'warning', 'error', 'info'] as const satisfies readonly BadgeVariant[]

const labels = {
  neutral: 'Draft',
  success: 'Listed',
  warning: 'Pending',
  error: 'Returned',
  info: 'Shipped',
} as const

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'fullscreen' },
  args: {
    children: 'Listed',
    variant: 'success',
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
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Status: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {badgeVariants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {labels[variant]}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {badgeVariants.map((variant) => (
          <Badge key={variant} variant={variant} dot>
            {labels[variant]}
          </Badge>
        ))}
      </div>
      <p className="flex items-center gap-2 text-body">
        Polaroid camera
        <Badge variant="success" dot>
          Listed
        </Badge>
      </p>
    </div>
  ),
}
