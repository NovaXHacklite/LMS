import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    connect(userId) {
        if (this.socket && this.isConnected) {
            return this.socket;
        }

        const token = localStorage.getItem('authToken');
        const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

        this.socket = io(serverUrl, {
            auth: {
                token: token,
                userId: userId
            },
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            this.isConnected = true;
            console.log('Connected to server');
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
            console.log('Disconnected from server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Progress update events
    onProgressUpdate(callback) {
        if (this.socket) {
            this.socket.on('progressUpdate', callback);
        }
    }

    offProgressUpdate(callback) {
        if (this.socket) {
            this.socket.off('progressUpdate', callback);
        }
    }

    // New message events
    onNewMessage(callback) {
        if (this.socket) {
            this.socket.on('newMessage', callback);
        }
    }

    offNewMessage(callback) {
        if (this.socket) {
            this.socket.off('newMessage', callback);
        }
    }

    // Achievement unlock events
    onAchievementUnlock(callback) {
        if (this.socket) {
            this.socket.on('achievementUnlock', callback);
        }
    }

    offAchievementUnlock(callback) {
        if (this.socket) {
            this.socket.off('achievementUnlock', callback);
        }
    }

    // Level up events
    onLevelUp(callback) {
        if (this.socket) {
            this.socket.on('levelUp', callback);
        }
    }

    offLevelUp(callback) {
        if (this.socket) {
            this.socket.off('levelUp', callback);
        }
    }

    // Streak update events
    onStreakUpdate(callback) {
        if (this.socket) {
            this.socket.on('streakUpdate', callback);
        }
    }

    offStreakUpdate(callback) {
        if (this.socket) {
            this.socket.off('streakUpdate', callback);
        }
    }

    // Emit events
    emitProgressUpdate(data) {
        if (this.socket && this.isConnected) {
            this.socket.emit('progressUpdate', data);
        }
    }

    emitQuizCompleted(data) {
        if (this.socket && this.isConnected) {
            this.socket.emit('quizCompleted', data);
        }
    }

    emitLessonCompleted(data) {
        if (this.socket && this.isConnected) {
            this.socket.emit('lessonCompleted', data);
        }
    }

    // Join user room for personal updates
    joinUserRoom(userId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('joinUserRoom', userId);
        }
    }

    // Leave user room
    leaveUserRoom(userId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('leaveUserRoom', userId);
        }
    }
}

const socketService = new SocketService();
export default socketService;
