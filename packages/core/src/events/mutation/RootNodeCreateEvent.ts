import { ICustomEvent } from '@designable/shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class RootNodeCreateEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'root:create'
}
