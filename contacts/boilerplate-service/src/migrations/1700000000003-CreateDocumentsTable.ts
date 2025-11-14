import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDocumentsTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'documents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'fileName',
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
            name: 'documentType',
            type: 'enum',
            enum: ['PDF', 'WORD', 'EXCEL', 'POWERPOINT', 'TEXT', 'IMAGE', 'OTHER'],
            default: "'OTHER'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED'],
            default: "'DRAFT'",
          },
          {
            name: 'tags',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'category',
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
            name: 'version',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'authorId',
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
      ALTER TABLE "documents" 
      ADD CONSTRAINT "FK_documents_author_id" 
      FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('documents');
  }
}
