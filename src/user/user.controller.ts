import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUserDto, UpdateUserDto, UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  getUserById(@Param('id') userId: string): Promise<UserDto> {
    return this.userService.getUserById(userId);
  }

  @Get('/')
  getUsers(): Promise<UserDto[]> {
    return this.userService.getUsers();
  }

  @Post('/')
  createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.userService.createUser(body);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
