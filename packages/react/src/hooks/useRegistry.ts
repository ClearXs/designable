import { GlobalRegistry, IDesignerRegistry } from '@clearx/designable-core'
import { globalThisPolyfill } from '@clearx/designable-shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
