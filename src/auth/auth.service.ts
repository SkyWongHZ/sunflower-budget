import { Injectable } from '@nestjs/common';
import {LoginDto} from   './dto/login.dto'
import  *  as bcrypt from  'bcrypt'
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private  readonly   prisma: PrismaService)  {}
  async login(loginDto: LoginDto) {
    const hashedPassword = await bcrypt.hash(loginDto.password, 10);
    const token = '123';
    const user = await this.prisma.user.findUnique({
      where: {   username: loginDto.username },  

      select: {
        id: true,
        username: true,
      },
    });
    console.log('user',user);
    return {
      token,
      user,
    };
  }
}
