import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFilesTable1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'files',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'fileName',
            type: 'varchar',
          },
          {
            name: 'originalName',
            type: 'varchar',
          },
          {
            name: 'filePath',
            type: 'varchar',
          },
          {
            name: 'fileSize',
            type: 'bigint',
          },
          {
            name: 'mimeType',
            type: 'varchar',
          },
          {
            name: 'fileHash',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'ERROR', 'DELETED'],
            default: "'UPLOADING'",
          },
          {
            name: 'thumbnailUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'previewUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'downloadCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'viewCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'metadata',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isPublic',
            type: 'boolean',
            default: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expiryDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'documentId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "files" 
      ADD CONSTRAINT "FK_files_document_id" 
      FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('files');
  }
}
