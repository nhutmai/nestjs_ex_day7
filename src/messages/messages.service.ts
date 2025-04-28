import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room } from '../rooms/schemas/room.schema';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  async sendMessage(dto: SendMessageDto, senderId: string) {
    const room = await this.roomModel.findById(dto.roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if (!room.members.includes(new Types.ObjectId(senderId))) {
      throw new NotFoundException('User not found');
    }

    const msg = new this.messageModel({
      sender: new Types.ObjectId(senderId),
      room: new Types.ObjectId(dto.roomId),
      content: dto.content,
    });

    return msg.save();
  }

  async getMessages(roomId: string) {
    return this.messageModel
      .find({ room: new Types.ObjectId(roomId) })
      .populate('sender', 'username')
      .sort({ createdAt: 1 })
      .lean();
  }
}
