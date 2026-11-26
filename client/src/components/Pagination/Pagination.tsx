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
    <div className="@container w-full min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-3 px-3 pt-3 @min-[40rem]:flex-row @min-[40rem]:items-center @min-[40rem]:justify-between">
        <div className="w-full min-w-0 @min-[40rem]:w-40">
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
        <div className="flex w-full min-w-0 flex-col gap-2 @min-[20rem]:flex-row @min-[20rem]:flex-wrap @min-[20rem]:items-center @min-[20rem]:justify-between @min-[40rem]:w-auto @min-[40rem]:flex-nowrap @min-[40rem]:justify-end @min-[40rem]:gap-3">
          <p className="min-w-0 text-body text-fg-muted">{rangeLabel(page, pageSize, totalItems)}</p>
          <div className="grid shrink-0 grid-cols-2 gap-2 @min-[20rem]:flex @min-[20rem]:gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full @min-[20rem]:w-auto"
              disabled={previousDisabled}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full @min-[20rem]:w-auto"
              disabled={nextDisabled}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
