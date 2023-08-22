import { FriendEntity } from 'src/utils/typeOrm/entities/firends.entity';
import { DeleteFirendParams } from 'src/utils/types';

export interface IFirendService {
  isFirends(userOne: number, userTwo: number): Promise<FriendEntity>;
  getFirends(userId: number): Promise<FriendEntity[]>;
  findFriendById(id: number): Promise<FriendEntity>;
  deleteFirendById(params: DeleteFirendParams);
}
