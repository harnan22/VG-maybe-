import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(fileData: {
    fileName: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    fileHash?: string;
    documentId?: string;
  }): Promise<File> {
    const file = this.fileRepository.create(fileData);
    return this.fileRepository.save(file);
  }

  async findAll(): Promise<File[]> {
    return this.fileRepository.find({
      relations: ['document'],
    });
  }

  async findOne(id: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id },
      relations: ['document'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async findByDocument(documentId: string): Promise<File[]> {
    return this.fileRepository.find({
      where: { documentId },
      relations: ['document'],
    });
  }

  async findByHash(fileHash: string): Promise<File | null> {
    return this.fileRepository.findOne({
      where: { fileHash },
      relations: ['document'],
    });
  }

  async update(id: string, updateData: Partial<File>): Promise<File> {
    const file = await this.findOne(id);
    Object.assign(file, updateData);
    return this.fileRepository.save(file);
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    file.status = 'DELETED' as any;
    await this.fileRepository.save(file);
  }

  async incrementViewCount(id: string): Promise<File> {
    const file = await this.findOne(id);
    file.viewCount += 1;
    return this.fileRepository.save(file);
  }

  async incrementDownloadCount(id: string): Promise<File> {
    const file = await this.findOne(id);
    file.downloadCount += 1;
    return this.fileRepository.save(file);
  }
}
