import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hash } from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const hashedPassword = await hash(password, 10);

    return await this.userModel.create({
      username,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<User[] | []> {
    return this.userModel.find();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.updateOne(updateUserDto);
    return user.save();
  }

  async blogUser(id: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, { isActive: false });
  }
}
