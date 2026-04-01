import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'

const IMMERSIVE_HTML_CLASS = 'immersive-input-active'

type ImmersiveContextValue = {
  activeId: string | null
  setActiveId: (id: string | null) => void
}

const ImmersiveContext = createContext<ImmersiveContextValue | null>(null)

export function ImmersiveFieldGroup({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  return (
    <ImmersiveContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </ImmersiveContext.Provider>
  )
}

function useImmersiveChrome() {
  const scheduleChromeCheck = useCallback(() => {
    queueMicrotask(() => {
      const el = document.activeElement
      const immersive =
        el instanceof HTMLTextAreaElement &&
        el.closest('[data-immersive-input-root]')
      if (!immersive) {
        document.documentElement.classList.remove(IMMERSIVE_HTML_CLASS)
      }
    })
  }, [])

  const onTextareaFocus = useCallback(() => {
    document.documentElement.classList.add(IMMERSIVE_HTML_CLASS)
  }, [])

  return { onTextareaFocus, scheduleChromeCheck }
}

export type ImmersiveInputProps = {
  label: string
  description?: string
  example?: string
  value: string
  onChange: (value: string) => void
} & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange' | 'children'
>

export function ImmersiveInput({
  label,
  description,
  example,
  value,
  onChange,
  id: idProp,
  className = '',
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...textareaProps
}: ImmersiveInputProps) {
  const reactId = useId()
  const id = idProp ?? `immersive-input-${reactId}`
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const ctx = useContext(ImmersiveContext)
  const { onTextareaFocus, scheduleChromeCheck } = useImmersiveChrome()

  const isPeerDimmed =
    ctx != null && ctx.activeId !== null && ctx.activeId !== id

  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${el.scrollHeight}px`
  }, [])

  useEffect(() => {
    resize()
  }, [value, resize])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
    onTextareaFocus()
    ctx?.setActiveId(id)
    onFocusProp?.(e)
  }

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    ctx?.setActiveId(null)
    scheduleChromeCheck()
    onBlurProp?.(e)
  }

  return (
    <div
      data-immersive-input-root
      className={`transition-opacity duration-300 ease-out ${
        isPeerDimmed
          ? 'pointer-events-none opacity-[0.12]'
          : 'opacity-100'
      }`}
    >
      <label
        htmlFor={id}
        className="block font-mono text-xs font-bold uppercase tracking-[0.2em] text-brutal-black"
      >
        {label}
      </label>
      {description ? (
        <p
          id={`${id}-desc`}
          className="mt-2 max-w-prose font-sans text-lg leading-snug text-brutal-black/80"
        >
          {description}
        </p>
      ) : null}
      {example ? (
        <details className="mt-3 max-w-prose group cursor-pointer">
          <summary className="font-mono text-xs uppercase tracking-wider text-brutal-black/50 hover:text-brutal-black transition-colors select-none">
            View Example
          </summary>
          <div className="mt-2 p-4 bg-brutal-black/5 border-l-2 border-brutal-black/20 font-sans text-base italic text-brutal-black/80 whitespace-pre-wrap">
            {example}
          </div>
        </details>
      ) : null}
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        rows={1}
        aria-describedby={description ? `${id}-desc` : undefined}
        className={[
          'mt-4 w-full resize-none border-0 border-b-2 border-brutal-black bg-transparent',
          'font-mono text-xl leading-relaxed tracking-tight text-brutal-black',
          'placeholder:text-brutal-black/25',
          'outline-none ring-0 focus:border-brutal-black focus:ring-0',
          className,
        ].join(' ')}
        {...textareaProps}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  )
}
