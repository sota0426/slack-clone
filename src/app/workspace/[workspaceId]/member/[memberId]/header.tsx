import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { FaChevronDown } from "react-icons/fa"
import { Button } from "@/components/ui/button"

interface HeaderProps{
  memberName?:string;
  memberImage?:string;
  onClick?:()=>void;
}

export const Header =({
  memberImage,
  memberName,
  onClick
}:HeaderProps)=>{

  const avatarFallback = memberName?.charAt(0).toUpperCase();


  return(
    <div className="bh-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        className="text-lg font-semibold h-[49px] flex items-center px-4 overflow-hidden"
        size="sm"
        onClick={onClick}
      >
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage}/>
          <AvatarFallback>
            {avatarFallback}
          </AvatarFallback>  
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  )
}