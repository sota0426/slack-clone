import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@radix-ui/react-separator"
import { SignInFlow } from "../types"
import { useState } from "react"
import { TriangleAlert } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"

interface SignUpCardProps{
    setState:(state:SignInFlow)=>void;
}

export const SignUpCard =({setState}:SignUpCardProps)=>{
    const {signIn}=useAuthActions();
    
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [error,setError]=useState("")
    const [pending , setPending]=useState(false);

    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if(password !==confirmPassword){
            setError("Password do not match");
            return;
        }
        setPending(true);
        signIn("password",{email, password,flow:"signUp"})
            .catch(()=>{
                setError("Something went wrong");
            })
            .finally(()=>{
                setPending(false);
            })
    }

    const handleProviderSignUp= (value:"github"|"google")=>{
        setPending(true);
        signIn(value)
            .finally(()=>{
                setPending(false);
            })
            
    }


    return (
        <Card className="w-full h-full p-8" >
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Sign Up to continue
                </CardTitle>
                <CardDescription>
                    use your email or another service to continue
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                </div>
            )}
            <CardContent className="space-y-5 px-o pb-0">
                <form onSubmit={onPasswordSignUp} className="space-y-2.5">
                <Input
                        disabled={pending}
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                    /> 
                    <Input
                        disabled={pending}
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        placeholder="Comfirm password"
                        type="password"
                        required
                    /> 

                    <Button type="submit" className="w-full" size="lg" disabled={pending}>
                        continue
                    </Button>                     
                </form>  
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        disabled={pending}
                        onClick={()=>handleProviderSignUp("google")}
                        variant="outline"
                        size="lg"
                        className="w-full relative"
                    >
                        continue with google
                    <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
                    </Button>
                    <Button
                        disabled={pending}
                        onClick={()=>handleProviderSignUp("github")}
                        variant="outline"
                        size="lg"
                        className="w-full relative"
                    >
                        continue with github
                    <FaGithub className="size-5 absolute top-2.5 left-2.5" />
                    </Button>                   
                </div>      
                <p className="text-xs text-muted-foreground">
                    Already have an account?
                     <span onClick={()=>setState("signIn")} className="text-sky-700 hover:underline cursor-pointer">Sign up</span>
                </p>

            </CardContent>
        </Card>
    )

}