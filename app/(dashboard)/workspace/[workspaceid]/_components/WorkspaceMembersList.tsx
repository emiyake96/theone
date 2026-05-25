import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

const members = [
    {
        id:1,
        name: "Alice",
        email: "alice@example.com",
        imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
        id:2,
        name: "Bob",
        email: "bob@example.com",
        imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
        id:3,
        name: "Charlie",
        email: "charlie@example.com",
        imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    }
]

export function WorkspaceMembersList() {
    return (
        <div className='space-y-0.5 py-1'>
            {members.map((member) => (
                <div 
                    key={member.id} 
                    className='px-3 py-2 hover:bg-accent cursor-pointer transition-colors 
                    flex items-center space-x-3'>
                    <div className='relative'>
                            <Avatar className='size-8 relative'>
                                <Image src={member.imageUrl} alt={member.name} className='object-cover rounded-2xl' fill sizes="small"/>
                                <AvatarFallback>
                                    {member.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                    </div>
                        <div className='flex-1 min-w-0'>
                            <p className='truncate text-sm font-medium'>{member.name}</p>
                            <p className='text-xs text-muted-foreground'>{member.email}</p>
                        </div>
                </div>
            ))}
        </div>
    )
}