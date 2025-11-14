import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Document } from './document.entity';

export enum FileStatus {
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  ERROR = 'ERROR',
  DELETED = 'DELETED',
}

@Entity('files')
export class File extends BaseEntity {
  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @Column()
  filePath: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  fileHash?: string;

  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.UPLOADING,
  })
  status: FileStatus;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ nullable: true })
  previewUrl?: string;

  @Column({ default: 0 })
  downloadCount: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ nullable: true })
  metadata?: string;

  @Column({ nullable: true })
  tags?: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column({ nullable: true })
  documentId?: string;

  @ManyToOne(() => Document, (document) => document.files, { nullable: true })
  @JoinColumn({ name: 'documentId' })
  document?: Document;
}
