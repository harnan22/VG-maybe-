import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';

export enum ProfileRole {
  CUSTOMER = 'CUSTOMER',
  REALTOR = 'REALTOR',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
}

@Entity('person_profiles')
export class PersonProfile extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({
    type: 'enum',
    enum: ProfileRole,
    default: ProfileRole.CUSTOMER,
  })
  profileRole: ProfileRole;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  jobTitle?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  linkedinUrl?: string;

  @Column({ nullable: true })
  twitterUrl?: string;

  @Column({ nullable: true })
  facebookUrl?: string;

  @Column({ nullable: true })
  instagramUrl?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @Column({ nullable: true })
  coverImageUrl?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  userId?: string;

  @OneToOne(() => User, (user) => user.personProfile, { cascade: true })
  @JoinColumn()
  user?: User;
}
