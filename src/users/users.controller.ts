import { Controller, Get, Request, Body, UseGuards, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  findOne(@Request() req) {
    return req.user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('update/:userId')
  async update(@Param('userId') userId: string, @Body() userUpdate: UpdateUserDto) {
    return this.usersService.updateUser(userId, userUpdate);
  }

  @Get('block/:userId')
  async block(@Param('userId') userId: string) {
    return this.usersService.blogUser(userId);
  }
}
