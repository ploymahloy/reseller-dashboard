import { Button } from '@/components/Button'
import { Select } from '@/components/Select'

export type PaginationProps = {
  page: number
  pageSize: number
  totalItems: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const rangeLabel = (page: number, pageSize: number, totalItems: number) => {
  if (totalItems === 0) return '0 items'
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)
  return `${start}\u2013${end} of ${totalItems}`
}

export const Pagination = ({
  page,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const previousDisabled = page <= 1 || totalItems === 0
  const nextDisabled = totalItems === 0 || page * pageSize >= totalItems
  const pageSizeSelect = pageSizeOptions ?? [10, 25, 50]

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 px-3">
      <div className="w-40">
        <Select
          label="Rows per page"
          value={String(pageSize)}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizeSelect.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-body text-fg-muted">{rangeLabel(page, pageSize, totalItems)}</p>
        <Button type="button" variant="outline" disabled={previousDisabled} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button type="button" variant="outline" disabled={nextDisabled} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}
