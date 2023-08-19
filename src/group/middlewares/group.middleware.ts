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
import { IGroupService } from '../group';

@Injectable()
export class GroupMiddleWare implements NestMiddleware {
  constructor(
    @Inject(Services.GROUP)
    private readonly groupService: IGroupService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { id: userId } = req.user || {};
    if (!userId) throw new UnauthorizedException('Unauthorized');
    const groupId = parseInt(req.params.groupId);
    console.log('inside middleware 11111111111111');
    if (isNaN(groupId)) throw new BadRequestException('can not get group');
    const user = await this.groupService.hasAccess({
      groupId,
      userId,
    });

    console.log(user);
    if (user) return next();
    else throw new NotFoundException('group Not found');
  }
}
