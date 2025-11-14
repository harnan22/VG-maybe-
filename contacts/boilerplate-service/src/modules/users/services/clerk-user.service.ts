import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class ClerkUserService {
  constructor(private readonly usersService: UsersService) {}

  async findOrCreateUser(userData: {
    clerkId?: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  }) {
    return this.usersService.findOrCreateUser(userData);
  }

  async findByClerkId(clerkId: string) {
    return this.usersService.findByClerkId(clerkId);
  }

  async updateUser(user: any) {
    return this.usersService.updateUser(user);
  }
}
