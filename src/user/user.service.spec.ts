import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserMapper } from 'src/user/mappers/user.mapper';

import { USERS_ALL_CACHE_KEY } from 'src/shared/constants';
import { UserDto } from 'src/user/dto/user.dto';

const repoMock = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const cacheMock = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(UserEntity), useValue: repoMock },
        { provide: CACHE_MANAGER, useValue: cacheMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('getUsers', () => {
    it('deve retornar do cache quando existir', async () => {
      const cachedDtos = [{ id: '1', name: 'Ana', email: 'ana@x.com' }];
      cacheMock.get.mockResolvedValueOnce(cachedDtos);

      const result = await service.getUsers();

      expect(cacheMock.get).toHaveBeenCalledWith(USERS_ALL_CACHE_KEY);
      expect(repoMock.find).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
      expect(result).toEqual(cachedDtos);
    });

    it('deve buscar do repo, mapear com UserMapper e salvar no cache quando não houver cache', async () => {
      const entities: UserEntity[] = [
        {
          id: '1',
          name: 'Ana',
          email: 'ana@x.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Bob',
          email: 'bob@x.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mappedDtos: UserDto[] = [
        {
          id: '1',
          name: 'Ana',
          email: 'ana@x.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Bob',
          email: 'bob@x.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      cacheMock.get.mockResolvedValueOnce(undefined);
      repoMock.find.mockResolvedValueOnce(entities);

      const toArraySpy = jest
        .spyOn(UserMapper, 'toDtoArray')
        .mockReturnValue(mappedDtos);

      const result = await service.getUsers();

      expect(cacheMock.get).toHaveBeenCalledWith(USERS_ALL_CACHE_KEY);
      expect(repoMock.find).toHaveBeenCalledTimes(1);
      expect(toArraySpy).toHaveBeenCalledWith(entities);
      expect(cacheMock.set).toHaveBeenCalledWith(
        USERS_ALL_CACHE_KEY,
        mappedDtos,
      );
      expect(result).toEqual(mappedDtos);
    });
  });

  describe('getUserById', () => {
    it('deve retornar o usuário quando encontrado', async () => {
      const entity = { id: '1', name: 'Ana', email: 'ana@x.com' } as UserEntity;
      repoMock.findOne.mockResolvedValueOnce(entity);

      const result = await service.getUserById('1');

      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBe(entity);
    });

    it('deve lançar NotFoundException quando não encontrar', async () => {
      repoMock.findOne.mockResolvedValueOnce(null);

      await expect(service.getUserById('x')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 'x' } });
    });
  });

  describe('createUser', () => {
    it('deve criar, salvar e mapear para DTO', async () => {
      const dto = {
        name: 'Ana',
        email: 'ana@x.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const entity = { id: '1', ...dto } as UserEntity;
      const mappedDto = { id: '1', ...dto };

      repoMock.create.mockReturnValueOnce(entity);
      repoMock.save.mockResolvedValueOnce(entity);

      const toDtoSpy = jest
        .spyOn(UserMapper, 'toDto')
        .mockReturnValue(mappedDto);

      const result = await service.createUser(dto);

      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(entity);
      expect(toDtoSpy).toHaveBeenCalledWith(entity);
      expect(result).toEqual(mappedDto);
    });
  });

  describe('updateUser', () => {
    it('deve atualizar, buscar e retornar DTO quando existir', async () => {
      const userId = '1';
      const payload = { name: 'Ana 2' };
      const createdAt = new Date();
      const updatedAt = new Date();
      const updatedEntity = {
        id: '1',
        name: 'Ana 2',
        email: 'ana@x.com',
        createdAt,
        updatedAt,
      } as UserEntity;
      const mappedDto = {
        id: '1',
        name: 'Ana 2',
        email: 'ana@x.com',
        createdAt,
        updatedAt,
      };

      repoMock.update.mockResolvedValueOnce(undefined);
      repoMock.findOne.mockResolvedValueOnce(updatedEntity);

      const toDtoSpy = jest
        .spyOn(UserMapper, 'toDto')
        .mockReturnValue(mappedDto);

      const result = await service.updateUser(userId, payload);

      expect(repoMock.update).toHaveBeenCalledWith(userId, payload);
      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(toDtoSpy).toHaveBeenCalledWith(updatedEntity);
      expect(result).toEqual(mappedDto);
    });

    it('deve lançar NotFoundException quando o usuário atualizado não existir', async () => {
      repoMock.update.mockResolvedValueOnce(undefined);
      repoMock.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateUser('nope', { name: 'x' }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(repoMock.update).toHaveBeenCalledWith('nope', { name: 'x' });
      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 'nope' } });
    });
  });

  describe('deleteUser', () => {
    it('deve chamar repo.delete com o id', async () => {
      repoMock.delete.mockResolvedValueOnce(undefined);

      await service.deleteUser('1');

      expect(repoMock.delete).toHaveBeenCalledWith('1');
    });
  });
});
