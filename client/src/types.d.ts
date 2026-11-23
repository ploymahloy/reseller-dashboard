export {}

declare module 'react' {
  interface HTMLAttributes<T> {
    'data-state'?: 'hover' | 'active' | 'focus'
  }
}
