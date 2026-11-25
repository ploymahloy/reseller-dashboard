import { Navigate, Outlet, Route, Routes } from "react-router";
import { Navbar } from "./layout";
import { AcquisitionsPage } from "./pages/AcquisitionsPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ListingsPage } from "./pages/ListingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const AppLayout = () => {
  return (
    <div className="flex min-h-svh w-full min-w-0 flex-col">
      <Navbar />
      <main className="min-w-0 flex-1 bg-zinc-200 p-4 sm:p-8 lg:p-12">
        <Outlet />
      </main>
    </div>
  )
}

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/inventory" replace />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="acquisitions" element={<AcquisitionsPage />} />
        <Route path="listings" element={<ListingsPage />} />
      </Route>
      <Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
