import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import type { CreateUserDto, UpdateUserDto, UserDto } from './dto/user.dto';

describe('UserController', () => {
  let controller: UserController;
  const createdAt = new Date();
  const updatedAt = new Date();

  const userList: UserDto[] = [
    { id: '1', name: 'Ana', email: 'ana@x.com', createdAt, updatedAt },
    { id: '2', name: 'Bob', email: 'bob@x.com', createdAt, updatedAt },
  ];

  const userServiceMock = {
    getUserById: jest.fn<Promise<UserDto>, [string]>(),
    getUsers: jest.fn<Promise<UserDto[]>, []>(),
    createUser: jest.fn<Promise<UserDto>, [CreateUserDto]>(),
    updateUser: jest.fn<Promise<UserDto>, [string, UpdateUserDto]>(),
    deleteUser: jest.fn<Promise<void>, [string]>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('getUsers', () => {
    it('deve retornar a lista de usuários do service', async () => {
      userServiceMock.getUsers.mockResolvedValueOnce(userList);

      const result = await controller.getUsers();

      expect(userServiceMock.getUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userList);
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário pelo id', async () => {
      const user: UserDto = {
        id: '1',
        name: 'Ana',
        email: 'ana@x.com',
        createdAt,
        updatedAt,
      };
      userServiceMock.getUserById.mockResolvedValueOnce(user);

      const result = await controller.getUserById('1');

      expect(userServiceMock.getUserById).toHaveBeenCalledWith('1');
      expect(result).toEqual(user);
    });

    it('deve propagar NotFoundException quando o service não encontrar', async () => {
      userServiceMock.getUserById.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(controller.getUserById('x')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(userServiceMock.getUserById).toHaveBeenCalledWith('x');
    });
  });

  describe('createUser', () => {
    it('deve criar um usuário via service e retornar o DTO', async () => {
      const payload: CreateUserDto = {
        name: 'Novo',
        email: 'novo@x.com',
      };

      const created: UserDto = { id: '3', createdAt, updatedAt, ...payload };

      userServiceMock.createUser.mockResolvedValueOnce(created);

      const result = await controller.createUser(payload);

      expect(userServiceMock.createUser).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });
  });

  describe('updateUser', () => {
    it('deve atualizar um usuário via service e retornar o DTO', async () => {
      const id = '1';
      const payload: UpdateUserDto = { name: 'Ana 2' };
      const updated: UserDto = {
        id,
        name: 'Ana 2',
        email: 'ana@x.com',
        createdAt,
        updatedAt,
      };

      userServiceMock.updateUser.mockResolvedValueOnce(updated);

      const result = await controller.updateUser(id, payload);

      expect(userServiceMock.updateUser).toHaveBeenCalledWith(id, payload);
      expect(result).toEqual(updated);
    });

    it('deve propagar NotFoundException quando o service não encontrar', async () => {
      userServiceMock.updateUser.mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.updateUser('nao-existe', { name: 'x' }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(userServiceMock.updateUser).toHaveBeenCalledWith('nao-existe', {
        name: 'x',
      });
    });
  });

  describe('deleteUser', () => {
    it('deve deletar pelo id via service', async () => {
      userServiceMock.deleteUser.mockResolvedValueOnce(undefined);

      await expect(controller.deleteUser('1')).resolves.toBeUndefined();

      expect(userServiceMock.deleteUser).toHaveBeenCalledWith('1');
      expect(userServiceMock.deleteUser).toHaveBeenCalledTimes(1);
    });
  });
});
