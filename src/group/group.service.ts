// src/groups/groups.service.ts
import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatGroup } from './entities/chat-group.entity';
import { GroupUser } from './entities/group-user.entity';
import { User } from 'src/auth/entity/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(ChatGroup)
    private groupRepository: Repository<ChatGroup>,
    @InjectRepository(GroupUser)
    private groupUserRepository: Repository<GroupUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto, userId: number) {
    const { title, description } = createGroupDto;

    const group = this.groupRepository.create({
      title,
      description,
      createdById: userId,
    });

    const savedGroup = await this.groupRepository.save(group);

    await this.addUserToGroup(savedGroup.id, userId);

    return this.getGroupById(savedGroup.id);
  }

  async getAllGroups() {
    return this.groupRepository.find({
      relations: ['createdBy', 'members', 'members.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getGroupById(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['createdBy', 'members', 'members.user', 'messages', 'messages.sender'],
      order: { messages: { createdAt: 'ASC' } },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async getUserGroups(userId: number) {
    const userGroups = await this.groupUserRepository.find({
      where: { userId },
      relations: ['group', 'group.createdBy', 'group.members', 'group.members.user'],
      order: { joinedAt: 'DESC' },
    });

    return userGroups.map(ug => ug.group);
  }

  async joinGroup(groupId: number, userId: number) {
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const existingMembership = await this.groupUserRepository.findOne({
      where: { groupId, userId },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a member of this group');
    }

    await this.addUserToGroup(groupId, userId);
    return this.getGroupById(groupId);
  }

  async leaveGroup(groupId: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['createdBy'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.createdById === userId) {
      throw new ForbiddenException('Group creator cannot leave the group');
    }

    const membership = await this.groupUserRepository.findOne({
      where: { groupId, userId },
    });

    if (!membership) {
      throw new NotFoundException('User is not a member of this group');
    }

    await this.groupUserRepository.remove(membership);
    return { message: 'Successfully left the group' };
  }

  async deleteGroup(groupId: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['createdBy'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.createdById !== userId) {
      throw new ForbiddenException('Only group creator can delete the group');
    }

    await this.groupRepository.remove(group);
    return { message: 'Group deleted successfully' };
  }

  async isUserMemberOfGroup(groupId: number, userId: number): Promise<boolean> {
    const membership = await this.groupUserRepository.findOne({
      where: { groupId, userId },
    });
    return !!membership;
  }

  private async addUserToGroup(groupId: number, userId: number) {
    const groupUser = this.groupUserRepository.create({
      groupId,
      userId,
    });

    await this.groupUserRepository.save(groupUser);
  }
}