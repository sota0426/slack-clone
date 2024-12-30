"use Client";

import { 
    Dialog,
    DialogContent,
   // DialogDescription,
    DialogHeader,
    DialogTitle 
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../../store/use-create-workspace-modal";

export const CreateWorkspaceModal =()=>{
    const [open , setOpen ]= useCreateWorkspaceModal();

    const handleClose =()=>{
        setOpen(false);
        //TODO:clear form
    }
    return(
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Workspace</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}