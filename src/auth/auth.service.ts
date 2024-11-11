import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const hashedPassword = await bcrypt.hash(loginDto.password, 10);

    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },

      select: {
        id: true,
        username: true,
      },
    });

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      user,
    };
  }
}
