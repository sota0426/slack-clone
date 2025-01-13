import { toast } from "sonner";
import dynamic from "next/dynamic";

import { format, isToday, isYesterday } from "date-fns";

import { useUpdateMessage } from "@/features/message/api/use-update-message";
import { useRemoveMessage } from "@/features/message/api/use-remove-message";

import { cn } from "@/lib/utils";

import { Hint } from "./hint";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Doc, Id } from "../../convex/_generated/dataModel"
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-panel";

const Renderer = dynamic(()=>import("@/components/renderer"), {ssr:false})
const Editor = dynamic(()=>import ("@/components/editor"),{ssr:false})

interface MessageProps{
  id:Id<"messages">;
  memberId:Id<"members">
  authorImage?:string;
  authorName?:string;
  isAuthor:boolean;
  reactions:Array<
    Omit<Doc<"reactions">,"memberId"> &{
      count : number;
      memberIds:Id<"members">[];
    }>
  body:Doc<"messages">["body"];
  image:string | null | undefined;
  createdAt:Doc<"messages">["_creationTime"];
  updatedAt:Doc<"messages">["updatedAt"];
  isEditing:boolean
  isCompact?:boolean;
  setEditingId:(id:Id<"messages"> | null )=>void;
  hideThreadButton?: boolean;
  threadCount?:number;
  threadImage?:string;
  threadTimestamp?:number;
}

const formatFullTime=(date:Date)=>{
  return `${isToday(date) 
            ? "Today" 
            : isYesterday(date) 
                ? "Yesterday" 
                : format(date , "MMM d, yyyy")} at ${format(date,"h:mm:ss a")}`
}


export const Message=({
  id,
  memberId,
  authorImage,
  authorName="Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
}:MessageProps)=>{

  const {parentMessageId , onOpenMessage, onClose}=usePanel();

 const [ConfirmDialog , confirm] = useConfirm(
    "Delete message",
    "Are you sure you want delete this message?"
  )

  const {mutate:updateMessage , isPending : isUpdatingMessage}=useUpdateMessage()
  const {mutate:removeMessage , isPending : isRemovingMessage}=useRemoveMessage()
  const {mutate : toggleReaction , isPending : isTogglingReaction}=useToggleReaction();

  const isPending = isUpdatingMessage;

  const handleReaction =(value:string)=>{
    toggleReaction({
      messageId:id,
      value
    },{
      onSuccess:()=>{
      },
      onError:()=>{
        toast.error("Failed to toggle reaction")
      },
    });
  };

  const handleDelete = async()=>{
    const ok = await confirm();
    if(!ok) return;

    removeMessage({id},{
      onSuccess:()=>{
        toast.success("Message deleted");

        if(parentMessageId === id){
          onClose();
        }
      },
      onError:()=>{
        toast.error("Failed to delete message")
      }
    })
  }

  const handleUpdate = ({body}:{body:string})=>{
    updateMessage({id , body},{
      onSuccess:()=>{
        toast.success("Message updated");
        setEditingId(null);
      },
      onError:()=>{
        toast.error("Failed to update message")
      }
    });
  }

  if(isCompact){ 
    return(
      <>
        <ConfirmDialog />
        <div className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
        )}>
          <div className="flex items-center gap-2">
            <Hint label={formatFullTime(new Date(createdAt) )}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt) , "hh:mm")}
              </button>
              </Hint>
              {isEditing ? (
                <div className="w-full h-full">
                  <Editor 
                    onSubmit={handleUpdate}
                    disabled={isPending}
                    defaultValue={JSON.parse(body)}
                    onCancel={()=>setEditingId(null)}
                    variant="update"
                  />
                </div>       
              ):(
              <div className="flex flex-col w-full">
                <Thumbnail url={image} />
                <Renderer value={body}/>
                {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span> 
                ):null}  
                <Reactions
                  data={reactions}
                  onChange={handleReaction}
                />
              </div>
              )}

            </div>
            {!isEditing &&(
              <Toolbar
                isAuthor={isAuthor}
                isPending ={isPending}
                handleEdit={()=>setEditingId(id)}
                handleThread={()=>onOpenMessage(id)}
                handleDelete={handleDelete}
                handleReaction={handleReaction}
                hideThreadButton={hideThreadButton}
              />
            )}
        </div>
      </>
    )
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return(
    <>
      <ConfirmDialog />
      <div className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
        isRemovingMessage && 
          "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
      )}>
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>

          {isEditing ? (
            <div className="w-full h-full">
              <Editor 
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={()=>setEditingId(null)}
                variant="update"
              />
            </div>
          ):(
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button onClick={()=>{}} className="font-bold text-primary hover:underline">
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt) )}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt) , "h:mm a")}
                  </button>
                </Hint>
              </div> 
              <div className="flex flex-col w-full">    
                <Renderer value={body} />
                <Thumbnail url={image} />
              </div>
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ):null}
                <Reactions
                  data={reactions}
                  onChange={handleReaction}
                />
            </div>
          )}
        </div>
        {!isEditing &&(
          <Toolbar
            isAuthor={isAuthor}
            isPending ={isPending}
            handleEdit={()=>setEditingId(id)}
            handleThread={()=>onOpenMessage(id)}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  )

}