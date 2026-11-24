import { Navbar } from "./layout";

const App = () => {
  return (
    <>
      <Navbar />

      <main className="flex min-h-svh items-center justify-center bg-zinc-200 text-zinc-100">
        <div className="max-w-md space-y-3 px-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Reseller dashboard</h1>
        </div>
      </main>
    </>
  )
};

export default App
