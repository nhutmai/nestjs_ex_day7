import { Document, Error } from 'mongoose';
import { Prop } from '@nestjs/mongoose';
import { SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  toObject(): { [x: string]: any; password: any } {
    throw new Error('Method are not allowed or not implemented');
  }

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [] })
  friends: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
