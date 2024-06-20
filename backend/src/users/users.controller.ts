import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUserDto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

export interface IUserRequest {
  user: {
    id: number;
    username: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Request() { user }: IUserRequest) {
    return this.usersService.findUserById(user.id);
  }
  @Patch('me')
  update(
    @Request() { user }: IUserRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  getOwnWishes(@Request() { user }: IUserRequest) {
    return this.usersService.findWishes(user.username);
  }
  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new BadRequestException('Пользователь не найден');
    return user;
  }
  @Get(':username/wishes')
  async getUsersWishes(@Param('username') username: string) {
    return this.usersService.findWishes(username);
  }

  @Post('find')
  async findMany(@Body() data: { query: string }) {
    return this.usersService.findUsers(data.query);
  }
}
