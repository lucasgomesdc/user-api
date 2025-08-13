import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers(): string[] {
    return [];
  }

  getUserById(userId: string | undefined): string {
    return `Hello User Lucas! ${userId}`;
  }

  createUser(): void {}

  updateUser(): void {}

  deleteUser(): void {}
}
