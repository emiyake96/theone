import { MessageItem } from "./message/MessageItem"

const messages = [
    {
        id: 1,
        content: 'Hello, how are you?',
        date: new Date(),
        avatar: 'https://avatars.githubusercontent.com/u/108645313?v=4',
        username: 'Eric Miyake'
    }
]

export function MessageList() {
    return (
        <div className='relative h-full'>
            <div className='h-full overflow-y-auto px-4 py-2'>
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        id={message.id}
                        message={message.content}
                        date={message.date}
                        avatar={message.avatar}
                        username={message.username}
                    />
                ))}
            </div>
        </div>
    )
}