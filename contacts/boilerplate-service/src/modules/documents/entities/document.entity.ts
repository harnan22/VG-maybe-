import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { File } from './file.entity';

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum DocumentType {
  PDF = 'PDF',
  WORD = 'WORD',
  EXCEL = 'EXCEL',
  POWERPOINT = 'POWERPOINT',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  OTHER = 'OTHER',
}

@Entity('documents')
export class Document extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.OTHER,
  })
  documentType: DocumentType;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @Column({ nullable: true })
  tags?: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ default: 0 })
  downloadCount: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ nullable: true })
  previewUrl?: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column({ nullable: true })
  version?: string;

  @Column({ nullable: true })
  authorId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'authorId' })
  author?: User;

  @OneToMany(() => File, (file) => file.document, { cascade: true })
  files?: File[];
}
