import { 
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle
   } from "@/components/ui/dialog"

import { useCreateChannelModal } from "../store/use-create-channel-modal"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChanel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const CreateChannelModal =()=>{
  const workspaceId = useWorkspaceId();
  const [ open , setOpen ] = useCreateChannelModal();
  const {mutate , isPending } = useCreateChanel();

  const [name , setName] = useState("");

  const handleClose=()=>{
    setName("");
    setOpen(false);
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value.replace(/\s+/g,"-").toLowerCase();
    setName(value);
  }

  const handleSubmit =( e:React.ChangeEvent<HTMLFormElement>)=>{
    e.preventDefault();
    mutate(
      {name , workspaceId},
      {
        onSuccess:(id)=>{
          //TODO:redirect to new Channel
          handleClose();

        }
      }
    )
  }

  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a channel
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button
            
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  
)

}