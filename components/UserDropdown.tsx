'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOutIcon } from "lucide-react"
import NavItems from "./NavItems"
import { signOut } from "@/lib/actions/auth.actions"


const UserDropdown = ({ user }: { user: User }) => {

    const router = useRouter();
    const handleSignout = async () => {
        await signOut();
        router.push("/sign-in");
    }


  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 text-gray-400 hover:text-yellow-500">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
              {user.name[0]} 
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
          </div>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-64 bg-gray-900 border border-gray-700 text-gray-300 shadow-lg rounded-xl p-2">
      
      <DropdownMenuLabel>
          <div className="flex items-center gap-3 p-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                  {user.name[0]} 
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-400">
                  {user.name}
                </span>
                <span className="text-sm text-gray-400 w-64">
                  {user.email}
                </span>
              </div>
          </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-gray-600"/>
      <DropdownMenuItem
        onClick={handleSignout}
        className="text-gray-300 text-sm font-medium focus:bg-gray-800 focus:text-yellow-400 cursor-pointer rounded-md px-2 py-2"
      >        
      <LogOutIcon className="h-4 w-4 mr-2 hidden sm:block"/>
        Log Out
      </DropdownMenuItem>
      <DropdownMenuSeparator className="hidden sm:block bg-gray-600"/>
      <nav className="sm:hidden">
        <NavItems/>
      </nav>
    </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
