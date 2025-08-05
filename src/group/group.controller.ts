// src/groups/groups.controller.ts
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
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { GroupsService } from './group.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupResponseDto } from './dto/group-response.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { User } from 'src/auth/entity/user.entity';
import { ChatGroup } from './entities/chat-group.entity';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Group successfully created',
    type: ChatGroup,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
    type: ErrorResponseDto,
  })
  async createGroup(
    @Body(ValidationPipe) createGroupDto: CreateGroupDto,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.createGroup(createGroupDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all groups',
    type: [ChatGroup],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
    type: ErrorResponseDto,
  })
  async getAllGroups() {
    return this.groupsService.getAllGroups();
  }

  @Get('my-groups')
  @ApiOperation({ summary: 'Get groups where current user is a member' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user\'s groups',
    type: [ChatGroup],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
    type: ErrorResponseDto,
  })
  async getUserGroups(@CurrentUser() user: User) {
    return this.groupsService.getUserGroups(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiParam({ name: 'id', description: 'Group ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Group details',
    type: ChatGroup,
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
  async getGroupById(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.getGroupById(id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a group' })
  @ApiParam({ name: 'id', description: 'Group ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully joined the group',
    type: GroupResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Group not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User is already a member of this group',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
    type: ErrorResponseDto,
  })
  async joinGroup(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.joinGroup(id, user.id);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Leave a group' })
  @ApiParam({ name: 'id', description: 'Group ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully left the group',
    type: GroupResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Group not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User is not a member of this group',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
    type: ErrorResponseDto,
  })
  async leaveGroup(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.leaveGroup(id, user.id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a group (only group creator can delete)' })
  @ApiParam({ name: 'id', description: 'Group ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Group successfully deleted',
    type: GroupResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Group not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only group creator can delete the group',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
    type: ErrorResponseDto,
  })
  async deleteGroup(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.deleteGroup(id, user.id);
  }
}