import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PersonProfile } from './person-profile.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  isActive: boolean;

  // Clerk integration
  @Column({ unique: true, nullable: true })
  clerkId?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  // Person Profile relationship
  @OneToOne(() => PersonProfile, (personProfile) => personProfile.user, { eager: true })
  personProfile?: PersonProfile;
}
