import { MessageEntity } from 'src/utils/typeOrm/entities/messages.entity';
import { CreateMessageParams } from 'src/utils/types';

export default interface IMessageService {
  createMessage(messageParams: CreateMessageParams);
  getMessagesByConversationId(conversationId: number): Promise<MessageEntity[]>;
}
