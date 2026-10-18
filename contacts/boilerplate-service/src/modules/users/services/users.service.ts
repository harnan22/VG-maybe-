import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PersonProfile, ProfileRole } from '../entities/person-profile.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PersonProfile)
    private readonly personProfileRepository: Repository<PersonProfile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        ...(createUserDto.clerkId ? [{ clerkId: createUserDto.clerkId }] : []),
      ],
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Create user
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    // Create person profile
    const personProfile = this.personProfileRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      profileRole: createUserDto.profileRole || ProfileRole.CUSTOMER,
      userId: savedUser.id,
    });

    await this.personProfileRepository.save(personProfile);

    // Update user with person profile
    savedUser.personProfile = personProfile;
    return this.userRepository.save(savedUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['personProfile'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['personProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { clerkId },
      relations: ['personProfile'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['personProfile'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Update user
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    // Update person profile if it exists
    if (user.personProfile && ('firstName' in updateUserDto || 'lastName' in updateUserDto)) {
      const personProfile = user.personProfile;
      if ('firstName' in updateUserDto && updateUserDto.firstName !== undefined) {
        personProfile.firstName = updateUserDto.firstName;
      }
      if ('lastName' in updateUserDto && updateUserDto.lastName !== undefined) {
        personProfile.lastName = updateUserDto.lastName;
      }
      await this.personProfileRepository.save(personProfile);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async findOrCreateUser(userData: {
    clerkId?: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  }): Promise<User> {
    let user: User | null = null;

    // Try to find by Clerk ID first if provided
    if (userData.clerkId) {
      user = await this.findByClerkId(userData.clerkId);
    }

    // If not found by Clerk ID, try by email
    if (!user) {
      user = await this.findByEmail(userData.email);
    }

    if (!user) {
      return this.create({
        clerkId: userData.clerkId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
      });
    }

    // Update existing user
    if (userData.clerkId && !user.clerkId) {
      user.clerkId = userData.clerkId;
    }
    if (userData.profileImageUrl) {
      user.profileImageUrl = userData.profileImageUrl;
    }

    return this.userRepository.save(user);
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
