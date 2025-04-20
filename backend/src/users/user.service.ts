import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserWithPassword } from './models';
import { UserMapper } from './mappers';
import { UserNotFoundError } from './errors';
import { Id } from '@src/common/domain';
import { UserEntity } from '@src/db';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  static mapToDomain(user: UserWithPassword | UserEntity): User {
    return UserMapper.toDomain(user);
  }

  async findById(id: Id): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });
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
    const newUser = await this.userRepository.save({
      ...userData,
      id: new Id().toString(),
      password: hashedPassword,
    });
    return UserService.mapToDomain(newUser);
  }
}
