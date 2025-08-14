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

//to do
// classvalidator

export type UpdateUserDto = Partial<CreateUserDto>;
