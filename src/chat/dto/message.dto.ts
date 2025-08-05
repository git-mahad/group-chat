import { IsString, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Hello everyone! How are you doing?',
    type: String,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: 'ID of the group to send the message to',
    example: 1,
    type: Number,
  })
  @IsNumber()
  groupId: number;
}