import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
     private readonly logger: LoggerService
    ) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        isActive: true,
        createdAt: true,
        password: false,
      },
    });
  }

  async findAll() {
    this.logger.log('Fetching all users', 'UsersService');
    const  users=await this.prisma.user.findMany({
      select:{
        id:true,
        email:true,
        username:true,
        age:true,
        isActive:true,
        createdAt:true,
      }
    })
    this.logger.log(`Found ${users.length} users`, 'UsersService');
    return users
  }

  async findOne(id: string) {
    const user=await  this.prisma.user.findUnique({
      where:{id},
      select:{
        id:true,
        email:true,
        username:true,
        age:true,
        isActive:true,
        createdAt:true,
      }
    })
    if(!user){
      throw new NotFoundException(`User with ID ${id} not found`);   
    }
    return  user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          username: true,
          age: true,
          isActive: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

  }

  async remove(id: string) {
    try {
      return  await  this.prisma.user.delete({
        where:{id},
        select:{
          id:true,
          email:true,
          username:true,
        }
      })
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
