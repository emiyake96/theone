'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { PortalLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAvatar } from "@/lib/get-avatar";

export function UserNav() {
  const { data : { user } } = useSuspenseQuery(orpc.workspace.list.queryOptions())
  const avatarSrc = getAvatar(user?.picture ?? null, user?.email ?? null)
  const initials = user?.given_name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-border/50 hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarSrc} alt={user?.given_name ?? 'User'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side='right' sideOffset={8} forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="text-sm font-medium text-gray-900">{user ? <div className="name">{user.given_name}</div> : <div className="name">John Doe</div>}</div>
            <p className="text-xs text-gray-500">{user ? user.email : "john.doe@example.com"}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <PortalLink>
              <User /> 
              Profile
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/workspace/billing">
              <CreditCard />
              Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LogoutLink>
              <LogOut />
              Logout
            </LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}