import { Module } from '@nestjs/common';
import { MessagesModule } from '../messages/messages.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MessagesModule,
    JwtModule.register({ secret: <string>process.env.JWT_SECRET }),
    AuthModule,
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
