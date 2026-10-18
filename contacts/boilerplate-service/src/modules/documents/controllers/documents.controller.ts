import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UsersService } from '../../users/services/users.service';

@ApiTags('documents')
@Controller('documents')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  async create(@Body() createDocumentDto: CreateDocumentDto, @CurrentUser() user: any) {
    const clerkId = user?.sub;
    if (!clerkId) {
      throw new NotFoundException('Invalid user token: Clerk ID not found');
    }
    // Get database user ID from Clerk ID
    const dbUser = await this.usersService.findByClerkId(clerkId);
    if (!dbUser) {
      throw new NotFoundException('User not found in database. Please ensure user is synced via webhook.');
    }
    return this.documentsService.create(createDocumentDto, dbUser.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by document status' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by document category' })
  @ApiQuery({ name: 'authorId', required: false, description: 'Filter by author ID' })
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('authorId') authorId?: string,
  ) {
    if (status) {
      return this.documentsService.findByStatus(status);
    }
    if (category) {
      return this.documentsService.findByCategory(category);
    }
    if (authorId) {
      return this.documentsService.findByAuthor(authorId);
    }
    return this.documentsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search documents' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  search(@Query('q') query: string) {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query is required');
    }
    return this.documentsService.searchDocuments(query);
  }

  @Get('my-documents')
  @ApiOperation({ summary: 'Get current user documents' })
  @ApiResponse({ status: 200, description: 'User documents retrieved successfully' })
  async getMyDocuments(@CurrentUser() user: any) {
    const clerkId = user?.sub;
    if (!clerkId) {
      throw new NotFoundException('Invalid user token: Clerk ID not found');
    }
    // Get database user ID from Clerk ID
    const dbUser = await this.usersService.findByClerkId(clerkId);
    if (!dbUser) {
      throw new NotFoundException('User not found in database. Please ensure user is synced via webhook.');
    }
    return this.documentsService.findByAuthor(dbUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findOne(@Param('id') id: string) {
    const document = await this.documentsService.findOne(id);
    await this.documentsService.incrementViewCount(id);
    return document;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Increment download count' })
  @ApiResponse({ status: 200, description: 'Download count incremented' })
  async incrementDownload(@Param('id') id: string) {
    return this.documentsService.incrementDownloadCount(id);
  }
}
