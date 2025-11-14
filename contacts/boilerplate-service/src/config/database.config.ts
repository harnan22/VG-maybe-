import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { PersonProfile } from '../modules/users/entities/person-profile.entity';
import { Document } from '../modules/documents/entities/document.entity';
import { File } from '../modules/documents/entities/file.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const sslConfig = configService.get('database.ssl') 
    ? { rejectUnauthorized: false } 
    : false;

  return {
    type: 'postgres',
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.database'),
    ssl: sslConfig,
    entities: [User, PersonProfile, Document, File],
    synchronize: false, // Always use migrations in production
    migrations: ['dist/migrations/*.js'],
    migrationsRun: false,
    logging: process.env.NODE_ENV === 'development',
    extra: {
      // Force IPv4 DNS resolution
      connectionString: undefined,
    },
    // Use node-postgres driver options to force IPv4
    driver: undefined,
  } as TypeOrmModuleOptions;
};
