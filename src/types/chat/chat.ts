export interface ChatMessage {
    sender_id: number;
    receiver_id: number;
    content: string;
    status: 'sent' | 'delivered' | 'read';
}
