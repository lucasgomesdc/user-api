import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../service/user-service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  getUserById(@Param('id') userId: string): string {
    return this.userService.getUserById(userId);
  }

  @Get('/')
  getUsers(): string[] {
    return [];
  }

  @Post('/')
  createUser(): void {}

  @Put('/:id')
  updateUser(): void {}

  @Delete('/:id')
  deleteUser(): void {}
}
