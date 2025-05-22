import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class CommentGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinPostRoom')
    handleJoinPostRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() postId: number,
    ) {
        client.join(`post-${postId}`);
        console.log(`Client ${client.id} joined post-${postId}`);
    }

    @SubscribeMessage('leavePostRoom')
    handleLeavePostRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() postId: number,
    ) {
        client.leave(`post-${postId}`);
        console.log(`Client ${client.id} left post-${postId}`);
    }

    sendNewComment(postId: number, comment: any) {
        this.server.to(`post-${postId}`).emit('newComment', comment);
    }
}