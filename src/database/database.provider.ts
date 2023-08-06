import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        synchronize: true,
        password: 'decksnod99m',
        username: 'root',
        database: 'chat',
        entities: ['dist/**/**/**/*.entity{.ts,.js}'],
      });
      return dataSource.initialize();
    },
  },
];
