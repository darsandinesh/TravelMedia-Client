export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  imagesUrl?: string[];
  videoUrl?: string;
  recordUrl?: string;
  totalDuriation?: number;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  recordDuration?: number;
  __v: number;
}

export interface LastMessage {
  read: any;
  chatId: string;
  content: string;
  createdAt: string;
  receiverId: string;
  senderId: string;
  updatedAt: string;
  _id: string;
}
export interface User {
  isOnline: any;
  id: string;
  name: string;
  avatar: string;
}


export interface ChatData {
  read: boolean;
  _id: string;
  lastMessage?: LastMessage | null;
  participants: string[];
  users: User[];
}
export interface MessageAreaProps {
  chat: ChatData;
  onBack?: () => void;
}

export interface ImageData {
  messages: Message[];
}
