import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '@/tokens/ThemePanels'
import { Pagination } from './Pagination'

const pageSizeOptions = [10, 25, 50]

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'fullscreen' },
  args: {
    page: 2,
    pageSize: 50,
    totalItems: 120,
    pageSizeOptions,
    onPageChange: () => {},
    onPageSizeChange: () => {},
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
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

const RangePagination = () => {
  const [page, setPage] = useState(2)
  const [pageSize, setPageSize] = useState(50)

  return (
    <Pagination
      page={page}
      pageSize={pageSize}
      totalItems={120}
      pageSizeOptions={pageSizeOptions}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  )
}

export const Range: Story = {
  render: () => <RangePagination />,
}

export const First: Story = {
  args: {
    page: 1,
    pageSize: 50,
    totalItems: 120,
  },
}

export const Last: Story = {
  args: {
    page: 3,
    pageSize: 50,
    totalItems: 120,
  },
}

export const Empty: Story = {
  args: {
    page: 1,
    pageSize: 50,
    totalItems: 0,
  },
}
