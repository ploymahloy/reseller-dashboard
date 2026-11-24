import { Navigate, Outlet, Route, Routes } from "react-router";
import { Navbar } from "./layout";
import { AcquisitionsPage } from "./pages/AcquisitionsPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ListingsPage } from "./pages/ListingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const AppLayout = () => {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-zinc-200 text-zinc-100">
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
