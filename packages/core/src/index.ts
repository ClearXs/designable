import * as Core from './exports'
import { globalThisPolyfill } from '@clearx/designable-shared'

globalThisPolyfill['Designable'] = globalThisPolyfill['Designable'] || {}
globalThisPolyfill['Designable'].Core = Core

export * from './exports'
