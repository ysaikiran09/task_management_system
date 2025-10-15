import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PermissionService } from './permission.service';
import { AccessControlGuard } from './access-control.guard';
import { User } from '../entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]), // Direct TypeORM import
  ],
  providers: [AuthService, JwtStrategy, PermissionService, AccessControlGuard],
  controllers: [AuthController],
  exports: [PermissionService, AccessControlGuard],
})
export class AuthModule {}
