import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { onScopeDispose, shallowReadonly, shallowRef, toValue } from 'vue'

export interface UseClipboardOptions {
  source: MaybeRefOrGetter<string>
  copiedDuring?: number
}

export interface UseClipboardReturn {
  copied: Readonly<ShallowRef<boolean>>
  copy: () => Promise<boolean>
}

export function useClipboard({
  source,
  copiedDuring = 1500
}: UseClipboardOptions): UseClipboardReturn {
  const copied = shallowRef(false)
  let copiedTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => {
    if (copiedTimer) {
      clearTimeout(copiedTimer)
    }
  })

  async function copy() {
    const value = toValue(source)
    const success = await writeClipboard(value)

    if (success) {
      copied.value = true
      resetCopiedLater()
    }

    return success
  }

  async function writeClipboard(value: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value)
        return true
      } catch {
        // Fall through to the legacy path.
      }
    }

    return legacyCopy(value)
  }

  function resetCopiedLater() {
    if (copiedTimer) {
      clearTimeout(copiedTimer)
    }

    copiedTimer = setTimeout(() => {
      copied.value = false
    }, copiedDuring)
  }

  function legacyCopy(value: string) {
    if (typeof document === 'undefined' || !document.body) {
      return false
    }

    const textarea = document.createElement('textarea')

    try {
      textarea.value = value
      textarea.style.position = 'absolute'
      textarea.style.opacity = '0'
      textarea.setAttribute('readonly', '')
      document.body.appendChild(textarea)
      textarea.select()
      return document.execCommand('copy')
    } catch {
      return false
    } finally {
      textarea.remove()
    }
  }

  return {
    copied: shallowReadonly(copied),
    copy
  }
}
