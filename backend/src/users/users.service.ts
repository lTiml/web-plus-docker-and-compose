import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private readonly logger: Logger;
  private readonly salt = 10;

  async create(createUserDTO: CreateUserDto) {
    const user = await this.userRepository.find({
      where: [
        { username: createUserDTO.username },
        { email: createUserDTO.email },
      ],
    });
    if (user.length) {
      throw new ConflictException(
        'Пользователь с таким username или email уже зарегистрирован',
      );
    }
    createUserDTO.password = await bcrypt.hash(
      String(createUserDTO.password),
      this.salt,
    );
    return await this.userRepository.save({
      ...createUserDTO,
      offers: [],
      wishes: [],
      wishlists: [],
    });
  }

  async findOne(search: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ email: search }, { username: search }],
    });
  }
  async findUserById(id: number) {
    const { password, ...user } = await this.userRepository.findOne({
      where: { id },
    });
    if (!user && !password) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }
  async findUsers(query: string) {
    return await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const isUsernameValid = await this.findOne(updateUserDto.username);
      if (isUsernameValid)
        throw new ConflictException(
          'Пользователь с таким именем уже зарегистрирован',
        );
    }
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const isEmailValid = await this.findOne(updateUserDto.email);
      if (isEmailValid)
        throw new ConflictException(
          'Пользователь с таким email уже зарегистрирован',
        );
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        String(updateUserDto.password),
        this.salt,
      );
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findUserById(id);
  }

  async findWishes(username: string) {
    const user = this.findOne(username);
    if (!user) {
      throw new NotFoundException('Пользователя не существует');
    }
    const { wishes } = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
      select: ['wishes'],
    });
    return wishes;
  }
}
