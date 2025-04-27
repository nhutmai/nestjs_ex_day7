import { Controller, Get, Post, Body, Param, Req, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: string;
  };
}

@UseGuards(AuthGuard('jwt'))
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto, @Req() req: RequestWithUser) {
    return await this.roomsService.createRoom(createRoomDto, req.user.userId);
  }

  @Post(':roomId/add-member/:userId')
  async addMember(@Param('roomId') roomId: string, @Param('userId') userId: string) {
    return await this.roomsService.addMember(roomId, userId);
  }

  @Get()
  async findRoom(@Req() req: RequestWithUser) {
    return await this.roomsService.findUserRoom(req.user.userId);
  }

  @Post('update/:roomId')
  async updateRoom(@Param('roomId') roomId: string, @Body() updateRoomDto: CreateRoomDto) {
    return await this.roomsService.updateRoom(roomId, updateRoomDto);
  }

  @Delete(':roomId')
  async deleteRoom(@Param('roomId') roomId: string) {
    return await this.roomsService.deleteRoom(roomId);
  }
}
