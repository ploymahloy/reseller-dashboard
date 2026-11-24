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

export const Table = <Row,>({
  columns,
  rows,
  getRowKey,
  caption,
  empty = 'No results',
  sort,
  onSort,
}: TableProps<Row>) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full border-collapse font-sans text-body text-fg">
        <caption className="caption-top px-4 py-3 text-left text-title">{caption}</caption>
        <thead>
          <tr className="border-b border-border text-label text-fg-muted">
            {columns.map((column) => {
              const alignRight = column.align === 'right'
              const sorted = sort?.columnId === column.id ? sort : undefined

              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={ariaSortFor(column.id, sort)}
                  className={cx('px-4 py-3', alignRight ? 'text-right tabular-nums' : 'text-left')}
                >
                  {column.sortable ? (
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
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-fg-muted">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowKey(row)} className="border-b border-border last:border-b-0">
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cx(
                      'px-4 py-3',
                      column.align === 'right' ? 'text-right tabular-nums' : 'text-left',
                    )}
                  >
                    {column.cell(row)}
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
