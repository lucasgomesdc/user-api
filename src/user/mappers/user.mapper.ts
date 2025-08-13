import { UserEntity } from '../entities/user.entity';
import type { UserDto } from '../dto/user.dto';

export class UserMapper {
  static toDto(entity: UserEntity): UserDto {
    const { id, name, email, createdAt, updatedAt } = entity;

    return {
      id,
      name,
      email,
      createdAt,
      updatedAt,
    };
  }

  static toDtoArray(entities: UserEntity[]): UserDto[] {
    return entities.map((e) => this.toDto(e));
  }
}
