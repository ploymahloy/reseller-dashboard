import { useEffect, useMemo, useState } from "react";

import { request } from "../api/request";
import { type Item, type ItemPage } from "../../../server/src/item/item.schema";
import { Table, type Column, type TableSort } from "../components/Table";

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
  { id: "name", header: "Name", sortable: true, cell: (item) => item.name },
  { id: "sku", header: "SKU", sortable: true, cell: (item) => item.sku },
  {
    id: "allocated_cost",
    header: "Cost",
    align: "right",
    sortable: true,
    cell: (item) => formatCost(item.allocated_cost),
  },
  { id: "condition", header: "Condition", sortable: true, cell: (item) => formatLabel(item.condition) },
  { id: "status", header: "Status", sortable: true, cell: (item) => formatLabel(item.status) },
];

const compareText = (left: string, right: string): number => {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

const compareItems = (left: Item, right: Item, columnId: string): number => {
  switch (columnId) {
    case "name":
      return compareText(left.name, right.name);
    case "sku":
      return compareText(left.sku, right.sku);
    case "allocated_cost":
      return left.allocated_cost - right.allocated_cost;
    case "condition":
      return compareText(formatLabel(left.condition), formatLabel(right.condition));
    case "status":
      return compareText(formatLabel(left.status), formatLabel(right.status));
    default:
      return 0;
  }
}

const nextSort = (current: TableSort | undefined, columnId: string): TableSort | undefined => {
  if (current?.columnId !== columnId) return { columnId, order: "asc" };
  if (current.order === "asc") return { columnId, order: "desc" };
  return undefined;
}

export const InventoryPage = () => {
  // Data state
  const [data, setData] = useState<Item[]>([]);
  const [_page, setPage] = useState(1);
  const [_pageSize, setPageSize] = useState(10);
  const [_totalItems, setTotalItems] = useState(0);

  // Request states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sort, setSort] = useState<TableSort | undefined>(undefined);

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

  const rows = useMemo(() => {
    if (!sort) return data;

    return [...data].sort((left, right) => {
      const compared = sort.order === "desc"
        ? compareItems(right, left, sort.columnId)
        : compareItems(left, right, sort.columnId);
      if (compared !== 0) return compared;
      return left.id - right.id;
    });
  }, [data, sort]);

  return (
    <Table
      caption="Inventory"
      columns={columns}
      empty={empty}
      getRowKey={(item) => item.id}
      rows={rows}
      sort={sort}
      onSort={(columnId) => setSort((current) => nextSort(current, columnId))}
    />
  );
};
