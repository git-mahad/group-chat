import { ApiProperty } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Successfully joined the group',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Group ID',
    example: 1,
    type: Number,
  })
  groupId?: number;
} 