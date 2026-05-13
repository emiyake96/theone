import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { PortalLink } from "@kinde-oss/kinde-auth-nextjs/components";

const UserAvatar = {
  src: "https://avatars.githubusercontent.com/u/108645313?v=4",
  alt: "User avatar"
};
export function UserNav() {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' className="size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-border/50 hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarImage src={UserAvatar.src} alt={UserAvatar.alt} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side='right' sideOffset={8} forceMount>
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">john.doe@example.com</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <PortalLink>
              <User /> 
              Profile
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
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