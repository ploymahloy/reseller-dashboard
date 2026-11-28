import { useId, type ReactNode } from 'react'

import { ItemSortOrder } from '@server/item/item.schema'
import { cx } from '@/utils/cx'
import { ChevronDownIcon, Icon } from '@/components/Icon'
import { controlClass } from '@/components/styles'

export type ColumnFilter =
  | { type: 'select'; options: ReadonlyArray<{ value: string; label: string }> }
  | { type: 'text' }

export type Column<Row> = {
  id: string
  header: ReactNode
  cell: (row: Row) => ReactNode
  align?: 'left' | 'right'
  width?: string
  filter?: ColumnFilter
}

export type TableSort = {
  columnId: string
  order: ItemSortOrder
}

export type TableFilter = {
  columnId: string
  value: string
}

export type TableProps<Row> = {
  columns: Array<Column<Row>>
  rows: Row[]
  getRowKey: (row: Row) => string | number
  caption: ReactNode
  empty?: ReactNode
  sort?: TableSort
  filters?: TableFilter[]
  onSort?: (sort: TableSort) => void
  onFilter?: (filter: TableFilter) => void
}

const sortOptionValue = (columnId: string, order: ItemSortOrder): string => `${columnId}:${order}`

const sortFromOption = (value: string): TableSort | undefined => {
  const splitAt = value.lastIndexOf(':')
  if (splitAt <= 0) return undefined
  const columnId = value.slice(0, splitAt)
  const order = ItemSortOrder.safeParse(value.slice(splitAt + 1))
  if (!order.success) return undefined
  return { columnId, order: order.data }
}

const columnLabel = (header: ReactNode, id: string): string => (typeof header === 'string' ? header : id)

const filterValue = (filters: TableFilter[], columnId: string): string =>
  filters.find((filter) => filter.columnId === columnId)?.value ?? ''

const FilterText = ({
  columnId,
  label,
  value,
  onFilter,
}: {
  columnId: string
  label: string
  value: string
  onFilter: (filter: TableFilter) => void
}) => (
  <input
    aria-label={label}
    placeholder={label}
    className={cx(controlClass, 'h-9 w-full px-3 sm:w-40')}
    value={value}
    onChange={(event) => onFilter({ columnId, value: event.target.value })}
  />
)

const FilterSelect = ({
  columnId,
  label,
  options,
  value,
  onFilter,
}: {
  columnId: string
  label: string
  options: ReadonlyArray<{ value: string; label: string }>
  value: string
  onFilter: (filter: TableFilter) => void
}) => (
  <div className="relative">
    <select
      aria-label={label}
      className={cx(controlClass, 'h-9 w-full appearance-none py-0 pr-9 pl-3 sm:w-auto')}
      value={value}
      onChange={(event) => onFilter({ columnId, value: event.target.value })}
    >
      <option value="">{`Any ${label.toLowerCase()}`}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <Icon
      size="sm"
      className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-fg-muted"
    >
      <ChevronDownIcon />
    </Icon>
  </div>
)

const ariaSortFor = (columnId: string, sort: TableSort | undefined): 'ascending' | 'descending' | 'none' => {
  if (sort?.columnId !== columnId) return 'none'
  return sort.order === 'asc' ? 'ascending' : 'descending'
}

export const Table = <Row,>({
  columns,
  rows,
  getRowKey,
  caption,
  empty = 'No results',
  sort,
  filters = [],
  onSort = () => { },
  onFilter = () => { }
}: TableProps<Row>) => {
  const captionId = useId()
  const sortId = useId()
  const sortedColumn = columns.find((column) => column.id === sort?.columnId)
  const sortStatus = sort
    ? `Sorted by ${columnLabel(sortedColumn?.header ?? sort.columnId, sort.columnId)}, ${sort.order === 'asc' ? 'ascending' : 'descending'}`
    : ''

  return (
    <div className="@container w-full min-w-0 max-w-full rounded-lg bg-surface @min-[48rem]:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 id={captionId} className="m-0 py-3 text-center sm:text-left text-heading @min-[48rem]:px-4">
          {caption}
        </h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {columns.map((column) => {
            if (!column.filter) return null
            const label = columnLabel(column.header, column.id)
            const value = filterValue(filters, column.id)
            if (column.filter.type === 'text') {
              return (
                <FilterText
                  key={column.id}
                  columnId={column.id}
                  label={label}
                  value={value}
                  onFilter={onFilter}
                />
              )
            }
            return (
              <FilterSelect
                key={column.id}
                columnId={column.id}
                label={label}
                options={column.filter.options}
                value={value}
                onFilter={onFilter}
              />
            )
          })}
          <div className="relative">
            <select
              id={sortId}
              aria-label="Sort"
              className={cx(controlClass, 'h-9 w-full appearance-none py-0 pr-9 pl-3 sm:w-auto')}
              value={sort ? sortOptionValue(sort.columnId, sort.order) : ''}
              onChange={(event) => {
                const next = sortFromOption(event.target.value)
                if (next) onSort(next)
              }}
            >
              <option value="" disabled>
                Sort
              </option>
              {columns.flatMap((column) => {
                const label = columnLabel(column.header, column.id)
                return ItemSortOrder.options.map((order) => (
                  <option key={sortOptionValue(column.id, order)} value={sortOptionValue(column.id, order)}>
                    {`${label} ${order === 'asc' ? 'ascending' : 'descending'}`}
                  </option>
                ))
              })}
            </select>
            <Icon
              size="sm"
              className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-fg-muted"
            >
              <ChevronDownIcon />
            </Icon>
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {sortStatus}
      </p>
      <table
        role="table"
        aria-labelledby={captionId}
        className="block w-full font-sans text-body text-fg @min-[48rem]:table @min-[48rem]:table-fixed @min-[48rem]:border-collapse"
      >
        <colgroup className="hidden @min-[48rem]:table-column-group">
          {columns.map((column) => (
            <col key={column.id} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead role="rowgroup" className="block @min-[48rem]:table-header-group">
          <tr
            role="row"
            className="sr-only border-b border-border text-label text-fg-muted @min-[48rem]:not-sr-only @min-[48rem]:table-row"
          >
            {columns.map((column) => {
              const alignRight = column.align === 'right'
              return (
                <th
                  key={column.id}
                  role="columnheader"
                  scope="col"
                  aria-sort={ariaSortFor(column.id, sort)}
                  className={cx('px-4 py-3', alignRight ? 'text-right tabular-nums' : 'text-left')}
                >
                  <span>{column.header}</span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody role="rowgroup" className="block @min-[48rem]:table-row-group">
          {rows.length === 0 ? (
            <tr role="row" className="block @min-[48rem]:table-row">
              <td
                role="cell"
                colSpan={columns.length}
                aria-colspan={columns.length}
                aria-live="polite"
                className="block px-0 py-6 text-center text-fg-muted @min-[48rem]:table-cell @min-[48rem]:px-4"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                role="row"
                className="block border-b border-border py-1 @min-[48rem]:table-row @min-[48rem]:py-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    role="cell"
                    className={cx(
                      'flex min-w-0 items-baseline justify-between gap-3 py-2',
                      '@min-[48rem]:table-cell @min-[48rem]:px-4 @min-[48rem]:py-3',
                      column.align === 'right'
                        ? '@min-[48rem]:text-right @min-[48rem]:tabular-nums'
                        : '@min-[48rem]:text-left',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="min-w-0 text-label text-fg-muted wrap-break-word @min-[48rem]:hidden"
                    >
                      {column.header}
                    </span>
                    <span
                      className={cx(
                        'min-w-0 wrap-break-word',
                        column.align === 'right' ? 'text-right tabular-nums' : 'text-left',
                      )}
                    >
                      {column.cell(row)}
                    </span>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
