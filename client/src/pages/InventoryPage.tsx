import { useEffect, useState } from "react";

import { request } from "../api/request";
import { type Item, type ItemPage } from "../../../server/src/item/item.schema";
import { Table, type Column } from "../components/Table/Table";

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
  { id: "sku", header: "SKU", cell: (item) => item.sku },
  {
    id: "allocated_cost",
    header: "Cost",
    align: "right",
    cell: (item) => formatCost(item.allocated_cost),
  },
  { id: "condition", header: "Condition", cell: (item) => formatLabel(item.condition) },
  { id: "status", header: "Status", cell: (item) => formatLabel(item.status) },
];

export const InventoryPage = () => {
  // Data state
  const [data, setData] = useState<Item[]>([]);
  const [_page, setPage] = useState(1);
  const [_pageSize, setPageSize] = useState(10);
  const [_totalItems, setTotalItems] = useState(0);

  // Request states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    request<ItemPage>("/items", { signal: controller.signal }).then((result) => {
      if (!result.ok && "aborted" in result) {
        return;
      }

      if (!result.ok) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setData(result.data.items);
      setPage(result.data.page);
      setPageSize(result.data.page_size);
      setTotalItems(result.data.total_items);
      setError(null);
      setIsLoading(false);
    });

    return () => controller.abort();
  }, []);

  const empty = isLoading ? "Loading…" : error ? error.message : "No items";

  return (
    <Table
      caption="Inventory"
      columns={columns}
      rows={data}
      getRowKey={(item) => item.id}
      empty={empty}
    />
  );
};
