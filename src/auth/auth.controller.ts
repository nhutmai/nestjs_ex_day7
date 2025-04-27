import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UsersService } from '../users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterAuthDto) {
    if (!registerDto.username || !registerDto.password) {
      throw new Error('Invalid credentials');
    }

    const existingUser = await this.userService.findByUsername(registerDto.username);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = await this.userService.create({
      username: registerDto.username,
      password: registerDto.password,
    });

    return { message: 'User created', userId: newUser._id };
  }

  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    if (!loginDto.username || !loginDto.password) {
      throw new Error('Invalid credentials');
    }

    const user = await this.authService.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return this.authService.login(user);
  }
}
