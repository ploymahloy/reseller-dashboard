import { useEffect, useState } from "react";

import { request } from "../api/request";
import { type Item, type ItemPage } from "../../../server/src/item/item.schema";

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
        setIsLoading(false);
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
      console.log(result.data);
    });

    setIsLoading(false);
    return () => controller.abort();
  }, []);

  const DynamicHeader = () => {
    if (error) return <div className="text-red-500">{error.message}</div>;
    if (isLoading) return <div className="text-center text-black">Loading...</div>;
    if (!error && !isLoading) return <div className="text-center text-black">Current Inventory</div>;
  }

  return (
    <div className="max-w-md space-y-3 px-6">
      <div className="max-w-md space-y-3 text-left text-black font-bold text-2xl">
        <DynamicHeader />
      </div>
      <ul>
        {data.map((item) => (
          <li key={item.id} className="border-b border-gray-200 py-2 text-black">
            {item.name} - {item.sku} - {item.allocated_cost} - {item.condition} - {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
