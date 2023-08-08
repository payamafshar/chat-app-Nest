import { DATASOURCE_TOKEN, Repositories } from 'src/utils/constants';
import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';
import { GroupMessageEntity } from 'src/utils/typeOrm/entities/groupMessage.entity';
import { DataSource } from 'typeorm';

export const groupProvider = [
  {
    provide: Repositories.GROUP,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GroupEntity),
    inject: [DATASOURCE_TOKEN],
  },
];
export const groupMessageProvider = [
  {
    provide: Repositories.GROUP_MESSAGE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GroupMessageEntity),
    inject: [DATASOURCE_TOKEN],
  },
];
