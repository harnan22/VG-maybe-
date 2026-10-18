import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from '../entities/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, authorId?: string): Promise<Document> {
    const document = this.documentRepository.create({
      ...createDocumentDto,
      authorId,
    });

    return this.documentRepository.save(document);
  }

  async findAll(): Promise<Document[]> {
    return this.documentRepository.find({
      relations: ['author', 'files'],
    });
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['author', 'files'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async findByAuthor(authorId: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: { authorId },
      relations: ['author', 'files'],
    });
  }

  async findByStatus(status: string): Promise<Document[]> {
    // Validate that status is a valid DocumentStatus enum value
    if (!Object.values(DocumentStatus).includes(status as DocumentStatus)) {
      throw new BadRequestException(`Invalid status: ${status}. Valid statuses are: ${Object.values(DocumentStatus).join(', ')}`);
    }
    return this.documentRepository.find({
      where: { status: status as DocumentStatus },
      relations: ['author', 'files'],
    });
  }

  async findByCategory(category: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: { category },
      relations: ['author', 'files'],
    });
  }

  async searchDocuments(query: string): Promise<Document[]> {
    return this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.author', 'author')
      .leftJoinAndSelect('document.files', 'files')
      .where('document.title ILIKE :query OR document.description ILIKE :query OR document.tags ILIKE :query', {
        query: `%${query}%`,
      })
      .getMany();
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.findOne(id);
    Object.assign(document, updateDocumentDto);
    return this.documentRepository.save(document);
  }

  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);
    document.status = DocumentStatus.DELETED;
    await this.documentRepository.save(document);
  }

  async incrementViewCount(id: string): Promise<Document> {
    const document = await this.findOne(id);
    document.viewCount += 1;
    return this.documentRepository.save(document);
  }

  async incrementDownloadCount(id: string): Promise<Document> {
    const document = await this.findOne(id);
    document.downloadCount += 1;
    return this.documentRepository.save(document);
  }
}
