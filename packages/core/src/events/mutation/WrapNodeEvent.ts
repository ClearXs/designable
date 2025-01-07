import { ICustomEvent } from '@clearx/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class WrapNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'wrap:node'
}
