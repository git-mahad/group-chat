// src/chat/chat.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entity/message.entity';
import { GroupsService } from 'src/group/group.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private groupsService: GroupsService,
  ) {}

  async createMessage(content: string, senderId: number, groupId: number) {
    const isMember = await this.groupsService.isUserMemberOfGroup(groupId, senderId);
    if (!isMember) {
      throw new ForbiddenException('User is not a member of this group');
    }

    const message = this.messageRepository.create({
      content,
      senderId,
      groupId,
    });

    const savedMessage = await this.messageRepository.save(message);

    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'group'],
    });
  }

  async getGroupMessages(groupId: number, userId: number) {
    const isMember = await this.groupsService.isUserMemberOfGroup(groupId, userId);
    if (!isMember) {
      throw new ForbiddenException('User is not a member of this group');
    }

    return this.messageRepository.find({
      where: { groupId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async deleteMessage(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.messageRepository.remove(message);
    return { message: 'Message deleted successfully' };
  }
}