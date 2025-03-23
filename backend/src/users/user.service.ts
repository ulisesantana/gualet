import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities';
import { User, UserWithPassword } from './models';
import { UserMapper } from './mappers';
import { UserNotFoundError } from './errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundError(id);
    }

    return UserService.mapToDomain(user);
  }

  async findByEmailWithPassword(email: string): Promise<UserWithPassword> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    return UserMapper.toUserWithPassword(user);
  }

  async create(userData: { email: string; password: string }): Promise<User> {
    // TODO: Check if user exists before doing anything
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    const newUser = await this.userRepository.save(user);
    return UserService.mapToDomain(newUser);
  }

  static mapToDomain(user: UserWithPassword | UserEntity): User {
    return UserMapper.toDomain(user);
  }
}
