import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  getUsers(): UserDto[] {
    const user: UserDto[] = [
      {
        id: '1234',
        name: 'Lucas',
        email: 'lucas.teste@teste.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return user;
  }

  getUserById(userId: string): UserDto {
    const user: UserDto = {
      id: userId,
      name: 'Lucas',
      email: 'lucas.teste@teste.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return user;
  }

  createUser(): void {}

  updateUser(): void {}

  deleteUser(): void {}
}
