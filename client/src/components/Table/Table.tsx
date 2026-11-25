import type { ReactNode } from 'react'

import { cx } from '../../utils/cx'
import { ChevronDownIcon, Icon } from '../Icon'
import { focusRing } from '../styles'

export type Column<Row> = {
  id: string
  header: ReactNode
  cell: (row: Row) => ReactNode
  align?: 'left' | 'right'
  sortable?: boolean
}

export type TableSort = {
  columnId: string
  order: 'asc' | 'desc'
}

export type TableProps<Row> = {
  columns: Array<Column<Row>>
  rows: Row[]
  getRowKey: (row: Row) => string | number
  caption: ReactNode
  empty?: ReactNode
  sort?: TableSort
  onSort?: (columnId: string) => void
}

const ariaSortFor = (columnId: string, sort: TableSort | undefined): 'ascending' | 'descending' | 'none' => {
  if (sort?.columnId !== columnId) return 'none'
  return sort.order === 'asc' ? 'ascending' : 'descending'
}

const SortButton = <Row,>({
  column,
  sort,
  onSort,
}: {
  column: Column<Row>
  sort?: TableSort
  onSort?: (columnId: string) => void
}) => {
  const sorted = sort?.columnId === column.id ? sort : undefined

  return (
    <button
      type="button"
      onClick={() => onSort?.(column.id)}
      className={cx(
        'inline-flex cursor-pointer items-center gap-1 rounded-md text-label text-fg-muted hover:text-fg',
        focusRing,
      )}
    >
      {column.header}
      {sorted ? (
        <Icon size="sm" className={sorted.order === 'asc' ? 'rotate-180' : undefined}>
          <ChevronDownIcon />
        </Icon>
      ) : null}
    </button>
  )
}

export const Table = <Row,>({
  columns,
  rows,
  getRowKey,
  caption,
  empty = 'No results',
  sort,
  onSort,
}: TableProps<Row>) => {
  const sortable = columns.filter((column) => column.sortable)

  return (
    <div className="@container w-full min-w-0 max-w-full rounded-lg border border-border bg-surface p-4 @min-[48rem]:p-8">
      <table className="block w-full font-sans text-body text-fg @min-[48rem]:table @min-[48rem]:border-collapse">
        <caption className="caption-top block py-3 text-center text-heading @min-[48rem]:table-caption @min-[48rem]:px-4">
          {caption}
        </caption>
        <thead className="block @min-[48rem]:table-header-group">
          {sortable.length > 0 ? (
            <tr className="block @min-[48rem]:hidden">
              <td colSpan={columns.length} className="block px-0 pb-3">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Sort">
                  {sortable.map((column) => (
                    <div key={column.id} role="columnheader" aria-sort={ariaSortFor(column.id, sort)}>
                      <SortButton column={column} sort={sort} onSort={onSort} />
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ) : null}
          <tr className="hidden border-b border-border text-label text-fg-muted @min-[48rem]:table-row">
            {columns.map((column) => {
              const alignRight = column.align === 'right'

              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={ariaSortFor(column.id, sort)}
                  className={cx('px-4 py-3', alignRight ? 'text-right tabular-nums' : 'text-left')}
                >
                  {column.sortable ? (
                    <SortButton column={column} sort={sort} onSort={onSort} />
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="block @min-[48rem]:table-row-group">
          {rows.length === 0 ? (
            <tr className="block @min-[48rem]:table-row">
              <td
                colSpan={columns.length}
                className="block px-0 py-6 text-center text-fg-muted @min-[48rem]:table-cell @min-[48rem]:px-4"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className="block border-b border-border py-1 last:border-b-0 @min-[48rem]:table-row @min-[48rem]:py-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cx(
                      'flex min-w-0 items-baseline justify-between gap-3 py-2',
                      '@min-[48rem]:table-cell @min-[48rem]:px-4 @min-[48rem]:py-3',
                      column.align === 'right'
                        ? '@min-[48rem]:text-right @min-[48rem]:tabular-nums'
                        : '@min-[48rem]:text-left',
                    )}
                  >
                    <span className="min-w-0 text-label text-fg-muted wrap-break-word @min-[48rem]:hidden">
                      {column.header}
                    </span>
                    <span
                      className={cx(
                        'min-w-0 wrap-break-word @min-[48rem]:contents',
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
