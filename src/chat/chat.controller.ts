import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  ValidationPipe,
  ParseIntPipe,
  HttpStatus,
  ForbiddenException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { GroupsService } from '../group/group.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { MessageDto } from './dto/message.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { User } from 'src/auth/entity/user.entity';
import { Message } from './entity/message.entity';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly groupsService: GroupsService,
  ) {}

  @Get('groups/:groupId/messages')
  @ApiOperation({ summary: 'Get messages from a group (Admin or group member only)' })
  @ApiParam({ name: 'groupId', description: 'Group ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of group messages',
    type: [Message],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Group not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - Admin or group member required',
    type: ErrorResponseDto,
  })
  async getGroupMessages(
    @Param('groupId', ParseIntPipe) groupId: number,
    @CurrentUser() user: User,
  ) {
    // Check if user is a member of the group
    const isMember = await this.groupsService.isUserMemberOfGroup(groupId, user.id);
    if (!isMember && user.role !== 'admin') {
      throw new ForbiddenException('You can only view messages from groups you are a member of');
    }

    return this.chatService.getGroupMessages(groupId, user.id);
  }

  @Post('groups/:groupId/messages')
  @ApiOperation({ summary: 'Send a message to a group (Group member only)' })
  @ApiParam({ name: 'groupId', description: 'Group ID', type: Number })
  @ApiBody({ type: MessageDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Message sent successfully',
    type: Message,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Group not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - Group member required',
    type: ErrorResponseDto,
  })
  async sendMessage(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body(ValidationPipe) messageDto: MessageDto,
    @CurrentUser() user: User,
  ) {
    // Ensure the message is for the correct group
    if (messageDto.groupId !== groupId) {
      throw new ForbiddenException('Message group ID must match the URL group ID');
    }

    return this.chatService.createMessage(messageDto.content, user.id, groupId);
  }

  @Delete('messages/:messageId')
  @ApiOperation({ summary: 'Delete a message (Message sender only)' })
  @ApiParam({ name: 'messageId', description: 'Message ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Message deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Message not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - Message sender only',
    type: ErrorResponseDto,
  })
  async deleteMessage(
    @Param('messageId', ParseIntPipe) messageId: number,
    @CurrentUser() user: User,
  ) {
    return this.chatService.deleteMessage(messageId, user.id);
  }
} 