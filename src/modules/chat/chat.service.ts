import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {


    getPreviousUserChats(userId: string, conversiationId: string, numChats: number) {
        // request messages from db
        // for message in chat_data:
        const messages: any = []
        let formatted_messages = []
        for (const message of messages) {
            const content_sender = message['role'] == 'user' ? 'Athlete' : 'Salus'
            formatted_messages.push({
                'role': message['role'], 'content': `${message['chat_timestamp']} ${content_sender}: ${message['message']}`
            })
            
        }

        return formatted_messages
    }

            

}
