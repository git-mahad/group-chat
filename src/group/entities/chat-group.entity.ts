// src/groups/entities/chat-group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { GroupUser } from './group-user.entity';
import { Message } from 'src/chat/entity/message.entity';

@Entity('chat_groups')
export class ChatGroup {
  @ApiProperty({
    description: 'Unique group identifier',
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Group title/name',
    example: 'General Discussion',
    type: String,
  })
  @Column({ length: 100 })
  title: string;

  @ApiProperty({
    description: 'Group description',
    example: 'A group for general discussions and announcements',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'ID of the user who created the group',
    example: 1,
    type: Number,
  })
  @Column()
  createdById: number;

  @ManyToOne(() => User, (user) => user.createdGroups)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ApiProperty({
    description: 'Group creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => GroupUser, (groupUser) => groupUser.group)
  members: GroupUser[];

  @OneToMany(() => Message, (message) => message.group)
  messages: Message[];
}