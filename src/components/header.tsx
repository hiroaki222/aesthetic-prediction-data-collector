'use client'
import { CircleUserRound, FilePenLine } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchUser, signout } from "@/utils/supabase/actions"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export function Header() {
  const t = useTranslations('header')
  const [role, setRole] = useState<boolean>(false);

  const adminPanel = async () => {
    const user = await fetchUser();
    const response = await fetch(`/api/get-role?uuid=${user?.id}`);
    const data = await response.json();
    if (data.role.role === true) {
      setRole(true);
    }
  }

  useEffect(() => {
    adminPanel();
  }, []);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center">
      <div className="flex w-full h-25 items-center justify-between px-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <FilePenLine className="size-5" />
        </div>
        <span className="ml-2 text-xl font-semibold">{t('app-title')}</span>
        <div className="flex-1"></div>
        <DropdownMenu>
          <DropdownMenuTrigger><CircleUserRound className="size-10 m-5" /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t('dropdown.my-account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('dropdown.setting')}</DropdownMenuItem>
            {role && (
              <DropdownMenuItem onClick={() => { redirect(`/admin`) }}>{t('dropdown.admin')}</DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={signout}>{t('dropdown.sign-out')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
