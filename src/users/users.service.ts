import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        username: createUserDto.username,
        password: await bcrypt.hash(createUserDto.password, 10),
        role: createUserDto.role,
      },
    });

    return {
      statusCode: 201,
      message: 'User created successfully',
      success: true,
      data: user,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      success: true,
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return {
        statusCode: 404,
        message: 'User not found',
        success: false,
        data: null,
      };
    }

    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      success: true,
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return {
      statusCode: 200,
      message: 'User updated successfully',
      success: true,
      data: user,
    };
  }

  async remove(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      message: 'User deleted successfully',
      success: true,
      data: user,
    };
  }
}