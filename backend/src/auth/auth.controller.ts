import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUpDto';
import { LocalAuthGuard } from './guards/local.guard';
import { TToken, TUser } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto): Promise<TUser> {
    return this.authService.signup(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req: { user: TUser }): Promise<TToken> {
    return this.authService.signin(req.user);
  }
}
