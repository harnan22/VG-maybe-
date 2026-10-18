import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { File } from './entities/file.entity';
import { DocumentsService } from './services/documents.service';
import { FilesService } from './services/files.service';
import { DocumentsController } from './controllers/documents.controller';
import { FilesController } from './controllers/files.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, File]),
    UsersModule,
  ],
  controllers: [DocumentsController, FilesController],
  providers: [DocumentsService, FilesService],
  exports: [DocumentsService, FilesService],
})
export class DocumentsModule {}
