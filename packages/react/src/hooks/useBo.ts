import { useWorkspace } from './useWorkspace'

export const useBo = (workspaceId?: string) => {
  const workspace = useWorkspace(workspaceId)
  return workspace?.engine.bo
}
