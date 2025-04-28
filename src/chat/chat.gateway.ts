import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server as WSServer, WebSocket } from 'ws';
import { MessagesService } from '../messages/messages.service';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';

@WebSocketGateway({
  path: '/ws',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: WSServer;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: WebSocket, req: IncomingMessage) {
    console.log('Raw req.url =', req.url);

    const url = new URL(req.url ?? '', 'http://localhost');
    const token = url.searchParams.get('token');
    // console.log('Token =', token);

    try {
      const payload = this.jwtService.verify(token!, {
        secret: process.env.JWT_SECRET,
      });
      (client as any).user = payload;
      console.log(`Client connected: ${payload.username}`);
    } catch (err) {
      console.error('JWT verify fail:', err.message);
      client.close();
    }
  }

  handleDisconnect(client: WebSocket) {
    // console.log('Client disconnected:', client.url);
  }

  afterInit(server: WSServer) {
    console.log('WebSocket server initialized');
  }

  private readonly rooms = new Map<string, Set<WebSocket>>();

  @SubscribeMessage('join_room')
  async handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: WebSocket) {
    if (!this.rooms.has(roomId)) this.rooms.set(roomId, new Set());
    this.rooms.get(roomId)!.add(client);

    client.send(JSON.stringify({ event: 'joined_room', data: roomId }));

    const history = await this.messagesService.getMessages(roomId);
    client.send(JSON.stringify({ event: 'chat_history', data: history }));

    console.log(`${(client as any).user.username} joined room ${roomId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() payload: { roomId: string; content: string },
    @ConnectedSocket() client: WebSocket,
  ) {
    const senderId = (client as any).user.sub;

    const message = await this.messagesService.sendMessage(
      { roomId: payload.roomId, content: payload.content },
      senderId,
    );

    const fullMessage = {
      _id: message._id,
      content: message.content,
      sender: { _id: senderId, username: (client as any).user.username },
      room: message.room,
      createdAt: message.createdAt,
    };

    this.rooms.get(payload.roomId)?.forEach(member => {
      if (member.readyState === WebSocket.OPEN) {
        member.send(JSON.stringify({ event: 'new_message', data: fullMessage }));
      }
    });
  }
}
