import { Controller, Post, Body, Request, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { Request as ExpressReq } from 'express';

interface ReqWithUser extends ExpressReq {
  user: {
    userId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(@Body() sendMessageDto: SendMessageDto, @Request() req: ReqWithUser) {
    return this.messagesService.sendMessage(sendMessageDto, req.user.userId);
  }

  @Get(':roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.messagesService.getMessages(roomId);
  }
}
