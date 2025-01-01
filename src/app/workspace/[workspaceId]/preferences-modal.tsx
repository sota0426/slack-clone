import { TrashIcon } from "lucide-react";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
  
interface PreferencesModalProps{
    open:boolean,
    setOpen: (open:boolean)=>void,
    initialValue:string,
}

export const PreferencesModal =({
    open,
    setOpen,
    initialValue
}:PreferencesModalProps)=>{
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const [ConfirmDialog,confirm]=useConfirm(
		"Are you Sure?","This action is irreversible."
	)

    const [value , setValue]=useState(initialValue);
	const [editOpen , setEditOpen]=useState(false);

	const {mutate : updateWorkSpace , isPending : isUpdatingWorkspace}=useUpdateWorkspace();
	const {mutate : removeWorkSpace , isPending : isRemovingWorkspace}=useRemoveWorkspace();

	const handleRemove= async ()=>{
		
		const ok = await confirm();

		if(!ok) return ;

		removeWorkSpace({
			id:workspaceId
		},{
			onSuccess:()=>{
				toast.success("Workspace removed")
				router.push("/")
			},
			onError:()=>{
				toast.error("Failed to remove workspace")
			}
		})

	}

	const handleEdit =(e:React.FormEvent<HTMLFormElement>)=>{
		e.preventDefault();

		updateWorkSpace({
			id:workspaceId,
			name:value,
		},{
			onSuccess:()=>{
				setEditOpen(false);
				toast.success("Workspace updated")
			},
			onError:()=>{
				toast.error("Failed to update workspace")
			}
		})

	}


    return(
		<>
			<ConfirmDialog />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="p-0 bg-gray-50 overflow-hidden">
					<DialogHeader className="p-4 border-b bg-white">
						<DialogTitle>
							{value}
						</DialogTitle>
					</DialogHeader>
					<div className="px-4 pb-4 flex flex-col gap-y-2">
						<Dialog open={editOpen} onOpenChange={setEditOpen}>
							<DialogTrigger asChild>
								<div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
									<div className="flex items-center justify-between">
										<p className="text-sm font-semibold">
											Workspace name
										</p>
										<p className="text-sm text-[#1264a3] hover:underline font-semibold">
											Edit
										</p>
									</div>
									<p className="text-sm">
										{value}
									</p>
								</div>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Rename this workspace</DialogTitle>
									</DialogHeader>
									<form className="space-y-4" onSubmit={handleEdit}>
										<Input 
											value={value}
											disabled={isUpdatingWorkspace}
											onChange={(e)=>setValue(e.target.value)}
											required
											autoFocus
											minLength={3}
											maxLength={80}
											placeholder="Workspace name e.g. 'Work','Personal','Home'"
										/>
										<DialogFooter>
											<DialogClose asChild>
												<Button variant="outline">
													Cancel
												</Button>													
											</DialogClose>
											<Button disabled={isUpdatingWorkspace}>
													Save
											</Button>													</DialogFooter>
									</form>

								</DialogContent>
						</Dialog>
								<button
								disabled={isRemovingWorkspace}
								onClick={handleRemove}
								className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 text-rose-600"
							>
								<TrashIcon />
								<p className="text-sm font-semibold">
									Delete workspace
								</p>
							</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
    );
};
