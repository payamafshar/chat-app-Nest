import { FirendRequestEntity } from 'src/utils/typeOrm/entities/firendRequest.entity';
import {
  AcceptFirendRequestParams,
  CancelFirendRequestParams,
  CreateFirendRequestParams,
  RejectFirendRequestParams,
} from 'src/utils/types';

export interface IFriendRequestService {
  create(params: CreateFirendRequestParams);
  findById(id: number): Promise<FirendRequestEntity>;
  getPendingRequest(userId: number): Promise<FirendRequestEntity[]>;
  isPending(userOneId: number, userTwoId: number): Promise<FirendRequestEntity>;
  acceptFirendRequest(params: AcceptFirendRequestParams);
  rejectFirendRequest(params: RejectFirendRequestParams);
  cancelFirendRequest(params: CancelFirendRequestParams);
}
