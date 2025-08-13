import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import type { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  getUserById(@Param('id') userId: string): UserDto {
    return this.userService.getUserById(userId);
  }

  @Get('/')
  getUsers(): UserDto[] {
    return this.userService.getUsers();
  }

  @Post('/')
  createUser(): void {}

  @Put('/:id')
  updateUser(): void {}

  @Delete('/:id')
  deleteUser(): void {}
}
