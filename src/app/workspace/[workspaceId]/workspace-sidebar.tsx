import { AlertTriangle,HashIcon,Loader, MessageSquareText, SendHorizontal } from "lucide-react";

import { useCurrentMember  } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";

import { useWorkspaceId } from "@/hooks/use-workspace-id"

import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";

export const WorkspaceSidebar =()=>{
    const workspaceId = useWorkspaceId();
    
    const {data:member , isLoading:memberLoading}=useCurrentMember({workspaceId});
    const {data :workspace  , isLoading:workspaceLoading} =useGetWorkspace({id : workspaceId})
    const {data : channels }=useGetChannels({workspaceId});
    const {data:members }=useGetMembers({workspaceId})

    if(memberLoading || workspaceLoading ){
        return (
            <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
                <Loader className="size-5 animate-spin text-white"/>
            </div>
        )
    }

    if(!member || !workspace ){
        return (
            <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
                <AlertTriangle className="size-5 text-white"/>
                <p className="text-white text-sm">
                    Workspace not found
                </p>

            </div>
        )
    }

    return(
        <div className="flex flex-col bg-[#5E2C5F] h-full ">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"}/>
            <div className="flex flex-col px-2 mt-3">
                <SidebarItem
                    label="Threads"
                    icon={MessageSquareText}
                    id="threads"
                />
                <SidebarItem
                    label="Drafts & Sent"
                    icon={SendHorizontal}
                    id="drafts"
                />            
                </div>

                <WorkspaceSection 
                    label="Channels"
                    hint="New channel"
                    onNew={()=>{}}
                >

                 {channels?.map((item)=>(
                    <SidebarItem 
                        key={item._id}
                        icon={HashIcon}
                        label={item.name}
                        id={item._id}
                    />
                ))} 
                </WorkspaceSection>

                <WorkspaceSection 
                    label="Direct message"
                    hint="New direct message"
                    onNew={()=>{}}
                >
                    {members?.map((item)=>(
                        <UserItem 
                            key={item._id}
                            id={item._id}
                            label={item.user.name}
                            image={item.user.image}
                        />
                    ))}
                </ WorkspaceSection>
        </div>
    )
}