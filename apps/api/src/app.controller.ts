import { Controller, Request, Post, UseGuards, Get, Body, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Public } from './public.provider';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('auth/login')
  async login(@Body() body: {username: string, password: string}, @Request() req) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (user){
      return await this.authService.login(user)
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }


  
  @Post('dogname')
  getDogName(@Request() req){
    return req.user
  }

}
 
