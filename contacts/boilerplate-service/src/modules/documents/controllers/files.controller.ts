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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FilesService } from '../services/files.service';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';

@ApiTags('files')
@Controller('files')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new file' })
  @ApiResponse({ status: 201, description: 'File created successfully' })
  create(@Body() fileData: {
    fileName: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    fileHash?: string;
    documentId?: string;
  }) {
    return this.filesService.create(fileData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  @ApiQuery({ name: 'documentId', required: false, description: 'Filter by document ID' })
  findAll(@Query('documentId') documentId?: string) {
    if (documentId) {
      return this.filesService.findByDocument(documentId);
    }
    return this.filesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async findOne(@Param('id') id: string) {
    const file = await this.filesService.findOne(id);
    await this.filesService.incrementViewCount(id);
    return file;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update file' })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.filesService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Increment download count' })
  @ApiResponse({ status: 200, description: 'Download count incremented' })
  async incrementDownload(@Param('id') id: string) {
    return this.filesService.incrementDownloadCount(id);
  }
}
