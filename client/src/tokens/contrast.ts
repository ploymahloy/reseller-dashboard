const channel = (value: number): number => {
  const srgb = value / 255
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
}

let sampleContext: CanvasRenderingContext2D | null = null

const readSrgb = (input: string): [number, number, number] => {
  if (!sampleContext) {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    sampleContext = canvas.getContext('2d', { willReadFrequently: true })
  }
  if (!sampleContext) {
    throw new Error('Canvas unavailable')
  }
  sampleContext.clearRect(0, 0, 1, 1)
  sampleContext.fillStyle = '#000'
  sampleContext.fillStyle = input
  sampleContext.fillRect(0, 0, 1, 1)
  const [red, green, blue] = sampleContext.getImageData(0, 0, 1, 1).data
  return [red, green, blue]
}

const luminance = (input: string): number => {
  const [red, green, blue] = readSrgb(input)
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
}

export const contrastRatio = (foreground: string, background: string): number => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

export const contrastLabel = (ratio: number): string => {
  const value = `${ratio.toFixed(2)}:1`
  if (ratio >= 7) return `${value} AAA`
  if (ratio >= 4.5) return `${value} AA`
  if (ratio >= 3) return `${value} AA UI`
  return `${value} Fail`
}
