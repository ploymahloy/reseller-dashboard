import { type JSX, useEffect, useState } from "react";

import { request } from "@/api/request";
import { type Item, type ItemPage, ItemCondition, ItemConditionLabel, ItemStatus, ItemStatusLabel } from "@server/item/item.schema";
import { Pagination, Table, type Column, type TableSort, type TableFilter } from "@/components";
import { Icon, SpinnerIcon } from "@/components/Icon";
import { formatCost } from "@server/shared/utils";

const conditionOptions = ItemCondition.options.map((value) => ({
  value,
  label: ItemConditionLabel[value],
}));

const statusOptions = ItemStatus.options.map((value) => ({
  value,
  label: ItemStatusLabel[value],
}));

const columns: Array<Column<Item>> = [
  { id: "name", header: "Name", width: "150px", cell: (item) => item.name },
  { id: "acquisition_id", header: "Acquisition ID", width: "120px", cell: (item) => item.acquisition_id },
  { id: "sku", header: "SKU", width: "150px", filter: { type: "text" }, cell: (item) => item.sku },
  { id: "allocated_cost", header: "Cost", align: "right", width: "100px", cell: (item) => formatCost(item.allocated_cost) },
  {
    id: "condition",
    header: "Condition",
    width: "120px",
    filter: { type: "select", options: conditionOptions },
    cell: (item) => ItemConditionLabel[item.condition],
  },
  {
    id: "status",
    header: "Status",
    width: "130px",
    filter: { type: "select", options: statusOptions },
    cell: (item) => ItemStatusLabel[item.status],
  },
];

export const InventoryPage = () => {
  // Data state
  const [data, setData] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Request states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sort, setSort] = useState<TableSort | undefined>(undefined);
  const [filters, setFilters] = useState<TableFilter[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    });

    if (sort) {
      params.set("sort", sort.columnId);
      params.set("order", sort.order);
    }

    for (const filter of filters) {
      const value = filter.value.trim();
      if (value !== "") params.set(filter.columnId, value);
    }

    request<ItemPage>(`/items?${params}`, { signal: controller.signal }).then((result) => {
      if (!result.ok && "aborted" in result) {
        return;
      }

      if (!result.ok) {
        setData([]);
        setTotalItems(0);
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setData(result.data.items);
      setTotalItems(result.data.total_items);
      setError(null);
      setIsLoading(false);
    });

    return () => controller.abort();
  }, [page, pageSize, sort, filters]);

  const spinnerOrMessage: JSX.Element =
    isLoading
      ? (
        <>
          <Icon size="xl">
            <SpinnerIcon />
          </Icon>
          <span className="sr-only">Loading</span>
        </>
      )
      : error
        ? <p>An error occurred while loading the items. Please refresh the page.</p>
        : <p>{filters.length > 0 ? "No items match these filters" : "No items"}</p>;

  return (
    <div className="bg-white rounded-lg p-4">
      <Table
        caption="Inventory"
        columns={columns}
        empty={spinnerOrMessage}
        getRowKey={(item) => item.id}
        rows={data}
        sort={sort}
        filters={filters}
        onSort={({ columnId, order }) => {
          setSort({ columnId, order });
          setPage(1);
        }}
        onFilter={(next) => {
          setFilters((current) => {
            const rest = current.filter((entry) => entry.columnId !== next.columnId);
            if (next.value.trim() === "") return rest.length === current.length ? current : rest;
            return [...rest, next];
          });
          setPage(1);
        }}
      />
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(page) => setPage(page)}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
        }}
      />
    </div>
  );
};
