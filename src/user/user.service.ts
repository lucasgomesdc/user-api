import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from './mappers/user.mapper';
import { USERS_ALL_CACHE_KEY } from 'src/shared/constants';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async getUsers(): Promise<UserDto[]> {
    const cached = await this.cache.get<UserDto[]>(USERS_ALL_CACHE_KEY);
    if (cached) return cached;

    const entities = await this.repo.find();
    const userList = UserMapper.toDtoArray(entities);

    await this.cache.set(USERS_ALL_CACHE_KEY, userList);

    return userList;
  }

  async getUserById(userId: string): Promise<UserDto> {
    const user = await this.repo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async createUser(userData: CreateUserDto): Promise<UserDto> {
    const entity = this.repo.create(userData);
    const saved = await this.repo.save(entity);
    return UserMapper.toDto(saved);
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<UserDto> {
    await this.repo.update(userId, data);
    const updated = await this.repo.findOne({ where: { id: userId } });
    if (!updated) throw new NotFoundException('Usuário não encontrado');
    return UserMapper.toDto(updated);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.repo.delete(userId);
  }
}
