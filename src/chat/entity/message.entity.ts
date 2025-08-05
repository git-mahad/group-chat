import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { ChatGroup } from 'src/group/entities/chat-group.entity';

@Entity('messages')
export class Message {
  @ApiProperty({
    description: 'Unique message identifier',
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello everyone! How are you doing?',
    type: String,
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    description: 'ID of the user who sent the message',
    example: 1,
    type: Number,
  })
  @Column()
  senderId: number;

  @ApiProperty({
    description: 'ID of the group where the message was sent',
    example: 1,
    type: Number,
  })
  @Column()
  groupId: number;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => ChatGroup, (group) => group.messages)
  @JoinColumn({ name: 'groupId' })
  group: ChatGroup;

  @ApiProperty({
    description: 'Message creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;
}