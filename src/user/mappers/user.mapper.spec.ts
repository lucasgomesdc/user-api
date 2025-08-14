import { UserMapper } from './user.mapper';
import type { UserEntity } from '../entities/user.entity';
import type { UserDto } from '../dto/user.dto';

describe('UserMapper', () => {
  const d1 = new Date('2025-01-01T12:00:00.000Z');
  const d2 = new Date('2025-01-02T12:00:00.000Z');

  describe('toDto', () => {
    it('mapeia os campos corretamente e ignora propriedades extras', () => {
      const entity = {
        id: '1',
        name: 'Ana',
        email: 'ana@x.com',
        createdAt: d1,
        updatedAt: d2,
        password: 'invalid-property',
      } as unknown as UserEntity;

      const dto = UserMapper.toDto(entity);

      const expected: UserDto = {
        id: '1',
        name: 'Ana',
        email: 'ana@x.com',
        createdAt: d1,
        updatedAt: d2,
      };

      expect(dto).toEqual(expected);
      expect(dto).not.toHaveProperty('password');
      expect(dto).not.toBe(entity);
    });

    it('propaga undefined quando datas estão ausentes', () => {
      const entity = {
        id: '2',
        name: 'Bob',
        email: 'bob@x.com',
        createdAt: undefined,
        updatedAt: undefined,
      } as unknown as UserEntity;

      const dto = UserMapper.toDto(entity);

      expect(dto.id).toBe('2');
      expect(dto.createdAt).toBeUndefined();
      expect(dto.updatedAt).toBeUndefined();
    });
  });

  describe('toDtoArray', () => {
    it('mapeia todos os itens delegando para toDto', () => {
      const entities: UserEntity[] = [
        {
          id: '1',
          name: 'Ana',
          email: 'ana@x.com',
          createdAt: d1,
          updatedAt: d2,
        },
        {
          id: '2',
          name: 'Bob',
          email: 'bob@x.com',
          createdAt: d2,
          updatedAt: d2,
        },
      ];

      const spy = jest.spyOn(UserMapper, 'toDto');

      const result = UserMapper.toDtoArray(entities);

      expect(spy).toHaveBeenCalledTimes(entities.length);
      expect(result).toEqual([
        {
          id: '1',
          name: 'Ana',
          email: 'ana@x.com',
          createdAt: d1,
          updatedAt: d2,
        },
        {
          id: '2',
          name: 'Bob',
          email: 'bob@x.com',
          createdAt: d2,
          updatedAt: d2,
        },
      ]);

      expect(entities[0].name).toBe('Ana');

      spy.mockRestore();
    });

    it('retorna array vazio quando entrada é vazia', () => {
      expect(UserMapper.toDtoArray([])).toEqual([]);
    });
  });
});
