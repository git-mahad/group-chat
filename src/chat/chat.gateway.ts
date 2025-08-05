// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
import { MessageDto } from './dto/message.dto';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  user?: any;
}

@ApiTags('chat')
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, number>();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Handle WebSocket connection with JWT authentication' })
  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.authService.validateUser(payload.sub);

      if (!user) {
        client.disconnect();
        return;
      }

      client.userId = user.id;
      client.user = user;
      this.connectedUsers.set(client.id, user.id);

      console.log(`User ${user.name} connected with socket ID: ${client.id}`);
      
      client.emit('connected', { message: 'Connected successfully', user: { id: user.id, name: user.name } });
      
    } catch (error) {
      console.log('Connection error:', error.message);
      client.disconnect();
    }
  }

  @ApiOperation({ summary: 'Handle WebSocket disconnection' })
  handleDisconnect(client: AuthenticatedSocket) {
    const userId = this.connectedUsers.get(client.id);
    this.connectedUsers.delete(client.id);
    console.log(`User ${userId} disconnected`);
  }

  @SubscribeMessage('joinGroup')
  @ApiOperation({ summary: 'Join a group chat room' })
  async handleJoinGroup(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { groupId: number },
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    try {
      const groupRoom = `group_${data.groupId}`;
      await client.join(groupRoom);
      
      client.to(groupRoom).emit('userJoined', {
        user: client.user,
        groupId: data.groupId,
        message: `${client.user.name} joined the group`,
      });

      client.emit('joinedGroup', { groupId: data.groupId, message: 'Successfully joined group chat' });
      
      console.log(`User ${client.user.name} joined group ${data.groupId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to join group' });
    }
  }

  @SubscribeMessage('leaveGroup')
  @ApiOperation({ summary: 'Leave a group chat room' })
  async handleLeaveGroup(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { groupId: number },
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const groupRoom = `group_${data.groupId}`;
    await client.leave(groupRoom);
    
    client.to(groupRoom).emit('userLeft', {
      user: client.user,
      groupId: data.groupId,
      message: `${client.user.name} left the group`,
    });

    console.log(`User ${client.user.name} left group ${data.groupId}`);
  }

  @SubscribeMessage('sendMessage')
  @ApiOperation({ summary: 'Send a message to a group' })
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody(ValidationPipe) messageDto: MessageDto,
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }
  
    try {
      const message = await this.chatService.createMessage(
        messageDto.content,
        client.userId,
        messageDto.groupId,
      );
  
      if (!message) {
        client.emit('error', { message: 'Failed to create message' });
        return;
      }
  
      const groupRoom = `group_${messageDto.groupId}`;
      
      this.server.to(groupRoom).emit('newMessage', {
        id: message.id,
        content: message.content,
        sender: {
          id: message.sender.id,
          name: message.sender.name,
        },
        groupId: message.groupId,
        createdAt: message.createdAt,
      });
  
      console.log(`Message sent in group ${messageDto.groupId} by ${client.user.name}`);
  
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('typing')
  @ApiOperation({ summary: 'Send typing indicator to group members' })
  async handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { groupId: number, isTyping: boolean },
  ) {
    if (!client.userId) return;

    const groupRoom = `group_${data.groupId}`;
    client.to(groupRoom).emit('userTyping', {
      user: client.user,
      groupId: data.groupId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('getOnlineUsers')
  @ApiOperation({ summary: 'Get list of online users in a group' })
  async handleGetOnlineUsers(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { groupId: number },
  ) {
    if (!client.userId) return;

    const groupRoom = `group_${data.groupId}`;
    const socketsInRoom = await this.server.in(groupRoom).fetchSockets();
    
    const onlineUsers = socketsInRoom.map((socket: any) => ({
      id: socket.userId,
      name: socket.user?.name,
    })).filter(user => user.id);

    client.emit('onlineUsers', { groupId: data.groupId, users: onlineUsers });
  }
}