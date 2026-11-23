import type { ReactNode } from 'react'

export const ThemePanels = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="min-w-0 rounded-lg border border-border bg-canvas p-6 text-fg">
        <p className="text-label mb-5 text-fg-muted">Light</p>
        {children}
      </section>
      <section className="dark min-w-0 rounded-lg border border-border bg-canvas p-6 text-fg">
        <p className="text-label mb-5 text-fg-muted">Dark</p>
        {children}
      </section>
    </div>
  )
}
