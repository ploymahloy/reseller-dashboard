import { useLayoutEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemePanels } from './ThemePanels'

const meta = {
  title: 'Foundations/Space',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const steps = [
  ['w-1', '1'],
  ['w-2', '2'],
  ['w-3', '3'],
  ['w-4', '4'],
  ['w-5', '5'],
  ['w-6', '6'],
  ['w-8', '8'],
  ['w-10', '10'],
  ['w-12', '12'],
  ['w-16', '16'],
] as const

const Bar = ({ className, name }: { className: string; name: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState('')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(getComputedStyle(el).width)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <div ref={ref} className={`h-4 bg-fg ${className}`} />
      <p className="text-caption w-6">{name}</p>
      <p className="text-caption text-fg-muted">{width}</p>
    </div>
  )
}

const radii = [
  ['rounded-sm', 'sm', ''],
  ['rounded-md', 'md', 'Buttons'],
  ['rounded-lg', 'lg', 'Cards'],
  ['rounded-xl', 'xl', ''],
  ['rounded-full', 'full', 'Pill'],
] as const

const Radius = ({ className, name, note }: { className: string; name: string; note: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setValue(getComputedStyle(el).borderRadius)
  }, [])

  return (
    <div className="grid justify-items-start gap-2">
      <div ref={ref} className={`size-16 border border-border-strong bg-surface ${className}`} />
      <p className="text-label">{name}</p>
      <p className="text-caption text-fg-muted">{[note, value].filter(Boolean).join(' · ')}</p>
    </div>
  )
}

const Surfaces = () => {
  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-6">
        {radii.map(([className, name, note]) => (
          <Radius key={name} className={className} name={name} note={note} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-label">Flat</p>
          <p className="text-caption text-fg-muted">Border</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <p className="text-label">Raised</p>
          <p className="text-caption text-fg-muted">shadow-sm and border</p>
        </div>
        <div className="rounded-lg border border-border-strong bg-surface p-4 shadow-lg">
          <p className="text-label">Overlay</p>
          <p className="text-caption text-fg-muted">shadow-lg and border-strong</p>
        </div>
      </div>
      <button
        type="button"
        className="text-body w-fit rounded-md border border-border-strong bg-surface px-4 py-2 ring ring-offset-2 ring-offset-canvas"
      >
        Focus ring
      </button>
    </div>
  )
}

export const Space: Story = {
  render: () => (
    <div className="grid gap-10 bg-canvas p-6 text-fg">
      <header className="grid gap-2">
        <h1 className="text-heading">Space</h1>
        <p className="text-body max-w-2xl text-fg-muted">
          Spacing stays on a 4px grid. Cards use lg and buttons use md. The focus ring is 2px, offset 2px from the control.
        </p>
      </header>
      <section className="grid gap-3">
        <h2 className="text-title">Spacing</h2>
        {steps.map(([className, name]) => (
          <Bar key={name} className={className} name={name} />
        ))}
      </section>
      <section className="grid gap-4">
        <h2 className="text-title">Radius, elevation, focus</h2>
        <ThemePanels>
          <Surfaces />
        </ThemePanels>
      </section>
    </div>
  ),
}
