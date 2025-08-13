import { Module } from '@nestjs/common';
import { UserController } from './user/controller/user-controller';
import { UserService } from './user/service/user-service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
