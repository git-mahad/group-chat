// src/groups/entities/group-user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { ChatGroup } from './chat-group.entity';

@Entity('group_users')
export class GroupUser {
  @ApiProperty({
    description: 'Unique group user relationship identifier',
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'ID of the user',
    example: 1,
    type: Number,
  })
  @Column()
  userId: number;

  @ApiProperty({
    description: 'ID of the group',
    example: 1,
    type: Number,
  })
  @Column()
  groupId: number;

  @ManyToOne(() => User, (user) => user.groupMemberships)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => ChatGroup, (group) => group.members)
  @JoinColumn({ name: 'groupId' })
  group: ChatGroup;

  @ApiProperty({
    description: 'Timestamp when user joined the group',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  @CreateDateColumn()
  joinedAt: Date;
}