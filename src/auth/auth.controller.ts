import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
// import {LoginUserDto}  from   './dto/login-user.dto'
import { LoginDto } from './dto/login.dto'; 
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {}





  @Post('login')
  @HttpCode(HttpStatus.OK)
   async login(@Body() loginDto: LoginDto) {
    const result=await this.authService.login(loginDto);
     return result
  }
}
