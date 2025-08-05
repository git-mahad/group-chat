import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum/user.role.enum'; 
import { ChatGroup } from 'src/group/entities/chat-group.entity';
import { GroupUser } from 'src/group/entities/group-user.entity';
import { Message } from 'src/chat/entity/message.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique user identifier',
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    type: String,
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'User email address (unique)',
    example: 'john.doe@example.com',
    type: String,
  })
  @Column({ unique: true, length: 150 })
  email: string;

  @ApiProperty({
    description: 'Hashed user password',
    example: 'hashedPassword123',
    type: String,
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'User role',
    example: UserRole.USER,
    enum: UserRole,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ChatGroup, (group) => group.createdBy)
  createdGroups: ChatGroup[];

  @OneToMany(() => GroupUser, (groupUser) => groupUser.user)
  groupMemberships: GroupUser[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}