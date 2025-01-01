"use client"

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace
    
 } from "@/features/workspaces/api/use-get-workspace";
const WorkspaceIdPage =()=>{
    const workspaceId = useWorkspaceId()
    const {data}=useGetWorkspace({id:workspaceId})

    return(
        <div className="bg-red-200 w-full">
            Workspace id page
        </div>
    )
}

export default WorkspaceIdPage;