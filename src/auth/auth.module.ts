import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Module({
  providers: [
    AuthService,
    PrismaService, // <--- Sudahkah Anda menambahkan ini?
    JwtAuthGuard,
    RolesGuard
  ],
})
export class AuthModule {}
