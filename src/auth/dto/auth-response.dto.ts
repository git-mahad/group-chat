import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYzNzI5NjAwMCwiZXhwIjoxNjM3MzgwMDAwfQ.example',
    type: String,
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: User,
  })
  user: User;
} 