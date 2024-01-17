import { useWorkspace } from './useWorkspace'

export const useBoViewPort = (workspaceId?: string) => {
  const workspace = useWorkspace(workspaceId)
  return workspace?.boView
}
