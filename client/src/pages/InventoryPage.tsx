import { type JSX, useEffect, useState } from "react";

import { request } from "@/api/request";
import { type Item, type ItemPage } from "@server/item/item.schema";
import { Pagination, Table, type Column, type TableSort } from "@/components";
import { Icon, SpinnerIcon } from "@/components/Icon";

const formatLabel = (value: string): string => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const formatCost = (cost: number): string => {
  return cost.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const columns: Array<Column<Item>> = [
  { id: "name", header: "Name", cell: (item) => item.name },
  { id: "sku", header: "SKU", width: "18%", cell: (item) => item.sku },
  { id: "allocated_cost", header: "Cost", align: "right", width: "8.5rem", cell: (item) => formatCost(item.allocated_cost) },
  { id: "condition", header: "Condition", width: "10rem", cell: (item) => formatLabel(item.condition) },
  { id: "status", header: "Status", width: "11rem", cell: (item) => formatLabel(item.status) },
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
  }, [page, pageSize, sort]);

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
        : <p>No items</p>;

  return (
    <div className="bg-white rounded-lg p-4">
      <Table
        caption="Inventory"
        columns={columns}
        empty={spinnerOrMessage}
        getRowKey={(item) => item.id}
        rows={data}
        sort={sort}
        onSort={({ columnId, order }) => {
          setSort({ columnId, order });
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
