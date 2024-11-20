import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

   private codeMap = new Map<string, {
    code: string;
    expires: number;
    retries: number;
  }>();
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {

    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.email },
      
      select: {
        id: true,
        email: true,
      },
    });

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      user,
    };
  }

  async  saveVerificationCode(email,code){
    this.codeMap.set(email, {
      code,
      expires: Date.now() + 300000, // 5分钟过期
      retries: 0
    });
    console.log('codeMap: ', this.codeMap);
  }
}
