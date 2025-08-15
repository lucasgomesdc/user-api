export type UserDto = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserDto = {
  name: string;
  email: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;
