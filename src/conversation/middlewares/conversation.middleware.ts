import {
  Inject,
  Injectable,
  NestMiddleware,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Services } from '../../utils/constants';
import { AuthenticatedRequest } from '../../utils/types';
import { IConversationService } from '../coversation';

@Injectable()
export class ConversationMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.CONVERSATION)
    private readonly conversationService: IConversationService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { id: userId } = req.user;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    const conversationId = parseInt(req.params.id);
    console.log('inside middleware 11111111111111');
    if (isNaN(conversationId))
      throw new BadRequestException('can not get conversation');
    const isReadable = await this.conversationService.hasAccess({
      conversationId,
      userId,
    });

    console.log(isReadable);
    if (isReadable) return next();
    else throw new NotFoundException('conversation Not found');
  }
}
