export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    sector?: string;
}

export interface ChatResponse {
    content: string;
    role: string;
}

export interface Setor {
    name: string;
}