import { CircleUserRound, FilePenLine } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signout } from "@/utils/supabase/actions"

export function Header() {


  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center">
      <div className="flex w-full h-25 items-center justify-between px-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <FilePenLine className="size-5" />
        </div>
        <span className="ml-2 text-xl font-semibold">Aesthetic Prediction Data Collector</span>
        <div className="flex-1"></div>
        <DropdownMenu>
          <DropdownMenuTrigger><CircleUserRound className="size-10 m-5" /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Setting</DropdownMenuItem>
            <DropdownMenuItem onClick={signout}>Sigh Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
