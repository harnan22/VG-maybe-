import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PersonProfile } from './entities/person-profile.entity';
import { UsersService } from './services/users.service';
import { ClerkUserService } from './services/clerk-user.service';
import { UsersController } from './controllers/users.controller';
import { WebhookController } from './controllers/webhook.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PersonProfile]),
  ],
  controllers: [UsersController, WebhookController],
  providers: [UsersService, ClerkUserService],
  exports: [UsersService, ClerkUserService],
})
export class UsersModule {}
