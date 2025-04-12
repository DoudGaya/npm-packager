import type { User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  user: Pick<User, "image" | "name">
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      {user.image ? (
        <AvatarImage alt="Profile picture" src={user.image} />
      ) : (
        <AvatarFallback>
          {user.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
            : "?"}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
