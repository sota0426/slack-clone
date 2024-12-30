import { useState } from "react";

import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateWorkspaceModal } from "@/features/store/use-create-workspace-modal";
import { useCreateWorkspace } from "../api/use-create-workspace";

export const CreateWorkspaceModal =()=>{
    const [open , setOpen ]= useCreateWorkspaceModal();
    const [name , setName] = useState("")

    const {mutate,isPending} = useCreateWorkspace();

    const handleClose =()=>{
        setOpen(false);
        //TODO:clear form
    }

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        mutate({name},{
            onSuccess(data){
                console.log(data);
            }
        })

    }

    return(
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <Input
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        disabled={isPending}
                        required
                        autoFocus
                        minLength={3}
                        placeholder="Workspace name e.g. 'Work' ,'Personal' and 'Home'"
                        className="w-full"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}