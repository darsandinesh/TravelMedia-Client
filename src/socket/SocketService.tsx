import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = 'http://localhost:4000';

class SocketService {
    private socket: Socket;

    constructor() {
        this.socket =  io('http://localhost:4000', {
            transports: ['websocket'],
            upgrade: false
          });

        this.socket.on('connect', () => {

        });

        this.socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                this.socket.connect();
            }
        });

        this.socket.on('connect_error', (error) => {
            console.log('Socker connection error', error);
        });

    }

    connect() {
        if (!this.socket.connected) {
            this.socket.connect();
        }
    }

    disconnect() {
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }

    joinConversation(chatId: string) {
        this.socket.emit('joinConversation', chatId);
    }

    sendMessage(message: { chatId: string, senderId: string, receiverId: string, content: string, imgaes?: string[], video?: string }) {
        this.socket.emit('sendMessage', message)
    }

    onNewMessage(callback: (message: any) => void) {
        this.socket.on('newMessage', callback);
    }

    emitUserOnline(userId: string) {
        this.socket.emit('userOnline', userId);
    }

    onUserStatusChanged(callback: (data: { userId: string, isOnline: boolean }) => void) {
        this.socket.on('userStatusChanged', callback)
    }
}

export default new SocketService();