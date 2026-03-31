
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  isPrompt?: boolean;
  timestamp: Date;
}
