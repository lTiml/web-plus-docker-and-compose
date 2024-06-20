import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { HashService } from 'src/hash/hash.service';
import { SignUpDto } from './dto/signUpDto';

export type TUser = Omit<User, 'password'>;
export type TToken = { access_token: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async validate(username: string, password: string): Promise<User> {
    const user = await this.userService.findOne(username);

    if (!user || !this.hashService.compare(password, user.password))
      return null;

    return user;
  }

  signup(signUpDto: SignUpDto): Promise<TUser> {
    return this.userService.create(signUpDto);
  }

  async signin(user: TUser) {
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });
    return {
      access_token: token,
    };
  }
}
