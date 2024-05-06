import { Server as SocketIOServer } from "socket.io";
import { verifyAccessToken } from "../services/token-utils";
import { getMessagesFromDB, saveMessageToDB } from "../db/chat/message-database";

// Функция для настройки WebSocket сервера
export const handleSocketConnection = (io: SocketIOServer) => {
    const usersOnline: Record<number, string> = {};

    io.use(async (socket, next) => {
        // Middleware для аутентификации
        try {
            const token = socket.handshake.auth.token;
            const user = await verifyAccessToken(token);
            if (user) {
                (socket as any).user_id = user.userId; // Сохраняем user_id в объекте сокета
                usersOnline[user.userId] = socket.id; // Сохраняем соответствие между userId и socketId
                next();
            } else {
                next(new Error("Authentication error"));
            }
        } catch (error) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`New connection: ${socket.id}`);

        socket.on("sendMessage", async ({ receiver_id, content, media_url }) => {
            try {
                const sender_id = (socket as any).user_id;
                const message = await saveMessageToDB({sender_id, receiver_id, content, media_url});
                const receiverSocketId = usersOnline[receiver_id]; // Находим сокет получателя
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receiveMessage', message); // Отправляем сообщение непосредственно получателю
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("getMessagesHistory", async ({ partnerId }) => {
            try {
                const userId = (socket as any).user_id;
                if (partnerId) {
                    const messages = await getMessagesFromDB(userId, partnerId);
                    socket.emit("messagesHistory", messages);
                }
            } catch (error) {
                console.error("Error getting messages history:", error);
            }
        });

        // Пример подписки на канал, идентифицированный по user_id
        const userId = (socket as any).user_id?.toString();
        socket.join(userId);

        socket.on("disconnect", () => {
            delete usersOnline[(socket as any).user_id];
            delete (socket as any).user_id;
            console.log(`Connection ${socket.id} closed`);
        });
    });
};
