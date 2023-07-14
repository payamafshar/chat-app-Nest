import { entities } from 'src/utils/typeOrm';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

// export const dataSourceOptions: DataSourceOptions = {
//   type: 'mysql',
//   host: process.env.MSQL_DB_HOST,
//   port: parseInt(process.env.MSQL_DB_PORT),
//   password: process.env.MSQL_DB_PASSWORD,
//   username: process.env.MSQL_DB_USERNAME,
//   database: process.env.MSQL_DB_NAME,
//   synchronize: true,
//   entities: [],
// };
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
