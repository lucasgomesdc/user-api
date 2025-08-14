import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { redisStore } from 'cache-manager-ioredis-yet';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): TypeOrmModuleOptions => ({
        type: cfg.getOrThrow<'mysql'>('DB_TYPE'),
        host: cfg.getOrThrow<string>('DB_HOST'),
        port: Number(cfg.getOrThrow<string>('DB_PORT')),
        username: cfg.getOrThrow<string>('DB_USER'),
        password: cfg.getOrThrow<string>('DB_PASS'),
        database: cfg.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: cfg.getOrThrow('TYPEORM_SYNC') === 'true',
        logging: false,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        store: await redisStore({
          host: cfg.get<string>('REDIS_HOST'),
          port: Number(cfg.get<string>('REDIS_PORT')),
          password: cfg.get<string>('REDIS_PASSWORD'),
          ttl: Number(cfg.get<string>('USERS_CACHE_TTL')),
        }),
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
