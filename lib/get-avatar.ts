export function getAvatar(userPicture: string | null, userEmail: string | null) {
    return userPicture ?? `https://avatar.vercel.sh/${userEmail ?? 'user'}`
}