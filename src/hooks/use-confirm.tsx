import { JSX, useState } from "react";

import { Button } from "@/components/ui/button";

import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter, 
    DialogHeader, 
    DialogTitle
} from "@/components/ui/dialog";

  export const useConfirm =(
    title:string,
    message:string
  ):[()=>JSX.Element,()=>Promise<unknown>]=>{

    const [promise,setPromise]=useState<{resolve:(value:boolean)=>void} | null >(null)

    const confirm =()=> new Promise((resolve ,  )=>{
        setPromise({resolve});
    });

    const handleClose = () =>{
        promise?.resolve(false);
        setPromise(null);
    }

    const handleCancel = () =>{
        promise?.resolve(false);
        handleClose();
    }

    const handleConfirm = () =>{
        promise?.resolve(true);
        handleClose();
    }


    const ConfirmDialog = ()=>(
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button 
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );


return[ConfirmDialog,confirm]

  }