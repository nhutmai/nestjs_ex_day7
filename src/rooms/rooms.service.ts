import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { Types } from 'mongoose';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private readonly roomModel: Model<Room>) {}

  async createRoom(createRoomDto: CreateRoomDto, createdId: string): Promise<Room> {
    const members = createRoomDto.members?.map(id => new Types.ObjectId(id)) || [];

    if (createRoomDto.type == 'private' && members.length > 2) {
      throw new BadRequestException('Room must have 2 members for private room');
    }

    if (!members.includes(new Types.ObjectId(createdId))) {
      members.push(new Types.ObjectId(createdId));
    }

    return this.roomModel.create({
      ...createRoomDto,
      members,
      createdBy: new Types.ObjectId(createdId),
    });
  }

  async addMember(roomId: string, userId: string): Promise<Room> {
    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.members.length >= 2 && room.type == 'private') {
      throw new BadRequestException('Room is full');
    }
    if (!room.members.includes(new Types.ObjectId(userId))) {
      room.members.push(new Types.ObjectId(userId));
    }

    return room.save();
  }

  async findUserRoom(userId: string): Promise<Room[]> {
    return this.roomModel.find({ members: userId }).populate('username');
  }

  async updateRoom(roomId: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    room.updateOne(updateRoomDto);
    return room.save();
  }

  async deleteRoom(roomId: string): Promise<Room | null> {
    return this.roomModel.findByIdAndDelete(roomId);
  }
}
