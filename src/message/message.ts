import { MessageEntity } from 'src/utils/typeOrm/entities/messages.entity';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import {
  CreateMessageParams,
  DeleteMessageParams,
  EditMessageParams,
} from 'src/utils/types';

export default interface IMessageService {
  createMessage(messageParams: CreateMessageParams);
  getMessagesByConversationId(
    conversationId: number,
    user: UserEntity,
  ): Promise<MessageEntity[]>;
  deleteMessageWithParams(params: DeleteMessageParams);

  editeMessageWithParams(params: EditMessageParams): Promise<MessageEntity>;
}
