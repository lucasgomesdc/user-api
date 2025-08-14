import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from './mappers/user.mapper';
import { USERS_ALL_CACHE_KEY } from 'src/shared/constants';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly ttlMiliseconds: number | undefined;

  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly configService: ConfigService,
  ) {
    this.ttlMiliseconds = Number(
      this.configService.get<string>('USERS_CACHE_TTL'),
    );
  }

  async getUsers(): Promise<UserDto[]> {
    const cached = await this.cache.get<UserDto[]>(USERS_ALL_CACHE_KEY);
    if (cached) return cached;

    const entities = await this.repo.find();
    const userList = UserMapper.toDtoArray(entities);

    await this.cache.set(USERS_ALL_CACHE_KEY, userList, this.ttlMiliseconds);

    return userList;
  }

  async getUserById(userId: string): Promise<UserDto> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async createUser(data: CreateUserDto): Promise<UserDto> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return UserMapper.toDto(saved);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserDto> {
    await this.repo.update(id, data);
    const updated = await this.repo.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Usuário não encontrado');
    return UserMapper.toDto(updated);
  }

  async deleteUser(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
