import { createElement, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from './ThemePanels'

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const Specimen = ({ as, className, children }: { as: ElementType; className: string; children: ReactNode }) => {
  const ref = useRef<HTMLElement>(null)
  const [spec, setSpec] = useState('')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const styles = getComputedStyle(el)
    setSpec(`${styles.fontSize} · ${styles.lineHeight} · ${styles.fontWeight}`)
  }, [])

  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
      {createElement(as, { ref, className }, children)}
      <p className="text-caption shrink-0 text-fg-muted">{spec}</p>
    </div>
  )
}

const Scale = () => {
  return (
    <div>
      <Specimen as="h1" className="text-display">
        Display
      </Specimen>
      <Specimen as="h2" className="text-heading">
        Heading
      </Specimen>
      <Specimen as="h3" className="text-title">
        Title
      </Specimen>
      <Specimen as="p" className="text-body">
        Body text for inventory, receipts, and listings.
      </Specimen>
      <Specimen as="p" className="text-body-sm">
        Body small for secondary sentences.
      </Specimen>
      <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
        <label htmlFor="foundation-label" className="text-label">
          Label
        </label>
        <input id="foundation-label" className="sr-only" defaultValue="Label" readOnly />
        <Measured className="text-label" />
      </div>
      <Specimen as="p" className="text-caption">
        Caption
      </Specimen>
    </div>
  )
}

const Measured = ({ className }: { className: string }) => {
  const ref = useRef<HTMLElement>(null)
  const [spec, setSpec] = useState('')

  useLayoutEffect(() => {
    const el = ref.current?.parentElement?.querySelector('label')
    if (!el) return
    const styles = getComputedStyle(el)
    setSpec(`${styles.fontSize} · ${styles.lineHeight} · ${styles.fontWeight}`)
    ref.current = el
  }, [])

  return <p className={`text-caption shrink-0 text-fg-muted ${className}`}>{spec}</p>
}

const Families = () => {
  const sans = useRef<HTMLParagraphElement>(null)
  const mono = useRef<HTMLParagraphElement>(null)
  const [sansName, setSansName] = useState('')
  const [monoName, setMonoName] = useState('')

  useLayoutEffect(() => {
    const first = (el: HTMLElement | null) => getComputedStyle(el!).fontFamily.split(',')[0]?.replaceAll('"', '') ?? ''
    setSansName(first(sans.current))
    setMonoName(first(mono.current))
  }, [])

  return (
    <div className="grid gap-4">
      <p ref={sans} className="font-sans text-body">
        Sans · {sansName} · The quick brown fox jumps over the lazy dog.
      </p>
      <p ref={mono} className="font-mono text-body">
        Mono · {monoName} · SKU-10482 · $240.00
      </p>
    </div>
  )
}

const Weights = () => {
  return (
    <div className="grid gap-2">
      <p className="font-regular text-[0.9375rem] leading-[1.375rem]">Regular 400</p>
      <p className="font-medium text-[0.9375rem] leading-[1.375rem]">Medium 500</p>
      <p className="font-semibold text-[0.9375rem] leading-[1.375rem]">Semibold 600</p>
    </div>
  )
}

export const Typography: Story = {
  render: () => (
    <div className="grid gap-10 bg-canvas p-6 text-fg">
      <header className="grid gap-2">
        <h1 className="text-heading">Typography</h1>
        <p className="text-body max-w-2xl text-fg-muted">
          Each role sets size, line height, and weight together. Families are the system sans and mono stacks.
        </p>
      </header>
      <section className="grid gap-4">
        <h2 className="text-title">Families</h2>
        <Families />
      </section>
      <section className="grid gap-4">
        <h2 className="text-title">Weights</h2>
        <Weights />
      </section>
      <section className="grid gap-4">
        <h2 className="text-title">Roles</h2>
        <ThemePanels>
          <Scale />
        </ThemePanels>
      </section>
    </div>
  ),
}
