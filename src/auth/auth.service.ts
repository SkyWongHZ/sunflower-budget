import { Injectable,UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

   private codeMap = new Map<string, {
    code: string;
    expires: number;
  }>();
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    await this.verifyCode(loginDto.email,loginDto.code)
    let user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      
      select: {
        id: true,
        email: true,
        username:true,
        role:true,
      },
    });

    if(!user){
       user=await this.prisma.user.create({
        data: {
          email: loginDto.email,
          username: `user_${Date.now()}`,
          password:'123456',
          role:'NORMAL_USER',
        },
        select: {
          id: true,
          email: true,
          username:true,
          role:true,
        },
      });
    }

    const payload = { sub: user.id, email: user.email ,role:user.role};
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      user,
    };
  }

  async  saveVerificationCode(email:string,code:string){
    this.codeMap.set(email, {
      code,
      expires: Date.now() + 5*60*1000, // 5分钟过期
    });
  }

  async  verifyCode(email:string,code:string){
    const data = this.codeMap.get(email);
    if (!data) {
      throw new UnauthorizedException('验证码不存在');
    }
    if (Date.now()> data.expires ) {
      throw new UnauthorizedException('验证码已过期');
    }
    if (data.code !== code) {
      throw new UnauthorizedException('验证码错误');
    }
    this.codeMap.delete(email)
    return true;
  }
}
