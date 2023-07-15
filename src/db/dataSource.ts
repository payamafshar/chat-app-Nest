import { entities } from 'src/utils/typeOrm';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  password: 'decksnod99m',
  username: 'root',
  database: 'chat_app',
  synchronize: true,
  entities: entities,
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
