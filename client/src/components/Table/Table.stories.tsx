import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from '../../tokens/ThemePanels'
import { Table, type Column, type TableProps, type TableSort } from './Table'

type SampleRow = {
  id: string
  name: string
  sku: string
  cost: number
}

const sampleRows: SampleRow[] = [
  { id: 'cam-104', name: 'Polaroid camera', sku: 'CAM-104', cost: 42 },
  { id: 'app-220', name: 'Wool coat', sku: 'APP-220', cost: 85 },
  { id: 'hom-018', name: 'Desk lamp', sku: 'HOM-018', cost: 16 },
]

const formatCost = (cost: number) => `$${cost.toFixed(2)}`

const columns: Array<Column<SampleRow>> = [
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'sku', header: 'SKU', cell: (row) => row.sku },
  {
    id: 'cost',
    header: 'Cost',
    align: 'right',
    cell: (row) => formatCost(row.cost),
  },
]

const byCost = (order: TableSort['order']) => (left: SampleRow, right: SampleRow) => {
  return order === 'asc' ? left.cost - right.cost : right.cost - left.cost
}

const CatalogTable = (props: TableProps<SampleRow>) => <Table {...props} />

const meta = {
  title: 'Components/Table',
  component: CatalogTable,
  parameters: { layout: 'fullscreen' },
  args: {
    caption: 'Catalog',
    columns,
    rows: sampleRows,
    getRowKey: (row: SampleRow) => row.id,
    empty: 'No results',
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
} satisfies Meta<typeof CatalogTable>

export default meta
type Story = StoryObj<typeof meta>

const PopulatedTable = () => {
  const [sort, setSort] = useState<TableSort | undefined>(undefined)
  const rows = sort?.columnId === 'cost' ? [...sampleRows].sort(byCost(sort.order)) : sampleRows

  return (
    <CatalogTable
      caption="Catalog"
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      sort={sort}
      onSort={setSort}
    />
  )
}

export const Populated: Story = {
  render: () => <PopulatedTable />,
}

export const Empty: Story = {
  args: {
    rows: [],
    empty: 'No results',
  },
}

export const Sorted: Story = {
  args: {
    rows: [...sampleRows].sort(byCost('desc')),
    sort: { columnId: 'cost', order: 'desc' },
    onSort: () => {},
  },
}
