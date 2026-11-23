import { useLayoutEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { contrastLabel, contrastRatio } from './contrast'
import { ThemePanels } from './ThemePanels'

const meta = {
  title: 'Foundations/Color',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const swatch = (step: string, className: string) => {
  return { step, className }
}

const brand = [
  swatch('50', 'bg-brand-50'),
  swatch('100', 'bg-brand-100'),
  swatch('200', 'bg-brand-200'),
  swatch('300', 'bg-brand-300'),
  swatch('400', 'bg-brand-400'),
  swatch('500', 'bg-brand-500'),
  swatch('600', 'bg-brand-600'),
  swatch('700', 'bg-brand-700'),
  swatch('800', 'bg-brand-800'),
  swatch('900', 'bg-brand-900'),
  swatch('950', 'bg-brand-950'),
]

const neutral = [
  swatch('50', 'bg-neutral-50'),
  swatch('100', 'bg-neutral-100'),
  swatch('200', 'bg-neutral-200'),
  swatch('300', 'bg-neutral-300'),
  swatch('400', 'bg-neutral-400'),
  swatch('500', 'bg-neutral-500'),
  swatch('600', 'bg-neutral-600'),
  swatch('700', 'bg-neutral-700'),
  swatch('800', 'bg-neutral-800'),
  swatch('900', 'bg-neutral-900'),
  swatch('950', 'bg-neutral-950'),
]

const semantic = [
  {
    name: 'Success',
    swatches: [
      swatch('100', 'bg-success-100'),
      swatch('300', 'bg-success-300'),
      swatch('400', 'bg-success-400'),
      swatch('500', 'bg-success-500'),
      swatch('600', 'bg-success-600'),
      swatch('700', 'bg-success-700'),
      swatch('800', 'bg-success-800'),
      swatch('900', 'bg-success-900'),
    ],
  },
  {
    name: 'Warning',
    swatches: [
      swatch('100', 'bg-warning-100'),
      swatch('300', 'bg-warning-300'),
      swatch('400', 'bg-warning-400'),
      swatch('500', 'bg-warning-500'),
      swatch('600', 'bg-warning-600'),
      swatch('700', 'bg-warning-700'),
      swatch('800', 'bg-warning-800'),
      swatch('900', 'bg-warning-900'),
    ],
  },
  {
    name: 'Error',
    swatches: [
      swatch('100', 'bg-error-100'),
      swatch('300', 'bg-error-300'),
      swatch('400', 'bg-error-400'),
      swatch('500', 'bg-error-500'),
      swatch('600', 'bg-error-600'),
      swatch('700', 'bg-error-700'),
      swatch('800', 'bg-error-800'),
      swatch('900', 'bg-error-900'),
    ],
  },
  {
    name: 'Info',
    swatches: [
      swatch('100', 'bg-info-100'),
      swatch('300', 'bg-info-300'),
      swatch('400', 'bg-info-400'),
      swatch('500', 'bg-info-500'),
      swatch('600', 'bg-info-600'),
      swatch('700', 'bg-info-700'),
      swatch('800', 'bg-info-800'),
      swatch('900', 'bg-info-900'),
    ],
  },
]

const Ramp = ({ name, swatches }: { name: string; swatches: Array<{ step: string; className: string }> }) => {
  return (
    <section className="grid gap-3">
      <h2 className="text-title">{name}</h2>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 lg:grid-cols-11">
        {swatches.map((item) => (
          <div key={item.step} className="grid gap-1">
            <div aria-hidden className={`h-12 rounded-md border border-border ${item.className}`} />
            <p className="text-caption text-fg-muted">{item.step}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

type PairProps = {
  label: string
  sample: string
  min: number
  kind?: 'text' | 'ui'
  plate?: string
}

const Pair = ({ label, sample, min, kind = 'text', plate = '' }: PairProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [result, setResult] = useState('…')
  const [pass, setPass] = useState(true)

  useLayoutEffect(() => {
    const pair = ref.current
    const sampleNode = pair?.querySelector<HTMLElement>('[data-sample]')
    if (!pair || !sampleNode) return
    const styles = getComputedStyle(sampleNode)
    const ratio =
      kind === 'ui'
        ? contrastRatio(styles.backgroundColor, getComputedStyle(pair).backgroundColor)
        : contrastRatio(styles.color, styles.backgroundColor)
    setResult(contrastLabel(ratio))
    setPass(ratio + 0.005 >= min)
  }, [kind, min])

  return (
    <div
      ref={ref}
      data-pair
      data-kind={kind}
      data-min={min}
      data-label={label}
      className={`flex items-center justify-between gap-4 ${plate}`}
    >
      {kind === 'text' ? (
        <p data-sample className={`text-body min-w-0 rounded-md px-3 py-2 ${sample}`}>
          {label}
        </p>
      ) : (
        <div className="flex min-w-0 items-center gap-3">
          <div data-sample aria-hidden className={`h-8 w-16 shrink-0 rounded-sm ${sample}`} />
          <p className="text-body">{label}</p>
        </div>
      )}
      <p className={`text-caption shrink-0 ${pass ? 'text-fg-muted' : 'text-fg'}`}>
        {pass ? result : `${result} · below ${min}:1`}
      </p>
    </div>
  )
}

const textPairs: PairProps[] = [
  { label: 'Primary on canvas', sample: 'bg-canvas text-fg', min: 4.5 },
  { label: 'Primary on surface', sample: 'bg-surface text-fg', min: 4.5 },
  { label: 'Muted on canvas', sample: 'bg-canvas text-fg-muted', min: 4.5 },
  { label: 'Muted on surface', sample: 'bg-surface text-fg-muted', min: 4.5 },
  { label: 'Brand on canvas', sample: 'bg-canvas text-brand-fg', min: 4.5 },
  { label: 'Brand on surface', sample: 'bg-surface text-brand-fg', min: 4.5 },
  { label: 'Success on canvas', sample: 'bg-canvas text-success-fg', min: 4.5 },
  { label: 'Success on surface', sample: 'bg-surface text-success-fg', min: 4.5 },
  { label: 'Warning on canvas', sample: 'bg-canvas text-warning-fg', min: 4.5 },
  { label: 'Warning on surface', sample: 'bg-surface text-warning-fg', min: 4.5 },
  { label: 'Error on canvas', sample: 'bg-canvas text-error-fg', min: 4.5 },
  { label: 'Error on surface', sample: 'bg-surface text-error-fg', min: 4.5 },
  { label: 'Info on canvas', sample: 'bg-canvas text-info-fg', min: 4.5 },
  { label: 'Info on surface', sample: 'bg-surface text-info-fg', min: 4.5 },
  { label: 'Brand fill', sample: 'bg-brand-solid text-on-brand', min: 4.5 },
  { label: 'Success fill', sample: 'bg-success-solid text-on-success', min: 4.5 },
  { label: 'Warning fill', sample: 'bg-warning-solid text-on-warning', min: 4.5 },
  { label: 'Error fill', sample: 'bg-error-solid text-on-error', min: 4.5 },
  { label: 'Info fill', sample: 'bg-info-solid text-on-info', min: 4.5 },
]

const uiPairs: PairProps[] = [
  { label: 'Strong border on surface', sample: 'bg-border-strong', plate: 'bg-surface p-2', min: 3, kind: 'ui' },
  { label: 'Focus on canvas', sample: 'bg-focus', plate: 'bg-canvas p-2', min: 3, kind: 'ui' },
  { label: 'Focus on surface', sample: 'bg-focus', plate: 'bg-surface p-2', min: 3, kind: 'ui' },
]

const Pairs = () => {
  return (
    <div className="grid gap-2">
      {textPairs.map((pair) => (
        <Pair key={pair.label} {...pair} />
      ))}
      {uiPairs.map((pair) => (
        <Pair key={pair.label} {...pair} />
      ))}
    </div>
  )
}

export const Color: Story = {
  render: () => (
    <div className="grid gap-10 bg-canvas p-6 text-fg">
      <header className="grid gap-2">
        <h1 className="text-heading">Color</h1>
        <p className="text-body max-w-2xl text-fg-muted">
          Light is the default theme. Dark follows the `dark` class. Text pairs are approved at 4.5:1.
          Borders and the focus color are approved at 3:1.
        </p>
      </header>
      <Ramp name="Brand" swatches={brand} />
      <Ramp name="Neutral" swatches={neutral} />
      {semantic.map((ramp) => (
        <Ramp key={ramp.name} name={ramp.name} swatches={ramp.swatches} />
      ))}
      <section className="grid gap-4">
        <h2 className="text-title">Approved pairs</h2>
        <ThemePanels>
          <Pairs />
        </ThemePanels>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const failures: string[] = []
    canvasElement.querySelectorAll<HTMLElement>('[data-pair]').forEach((pair) => {
      const sample = pair.querySelector<HTMLElement>('[data-sample]')
      if (!sample) return
      const styles = getComputedStyle(sample)
      const min = Number(pair.dataset.min)
      const ratio =
        pair.dataset.kind === 'ui'
          ? contrastRatio(styles.backgroundColor, getComputedStyle(pair).backgroundColor)
          : contrastRatio(styles.color, styles.backgroundColor)
      if (ratio + 0.005 < min) {
        const theme = pair.closest('.dark') ? 'dark' : 'light'
        failures.push(`${theme} ${pair.dataset.label}: ${ratio.toFixed(2)}:1`)
      }
    })
    if (failures.length > 0) {
      throw new Error(failures.join('\n'))
    }
  },
}
