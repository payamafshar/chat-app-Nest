import {
  Controller,
  Inject,
  Get,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { IFirendService } from './firends';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';

@Controller('firends')
export class FirendsController {
  constructor(
    @Inject(Services.FIRENDS) private readonly firendsService: IFirendService,
  ) {}

  @Get('findAll')
  findAll(@AuthUser() user: UserEntity) {
    console.log('1111');
    return this.firendsService.getFirends(user.id);
  }

  @Delete('/:firendId')
  deleteFirend(
    @Param('firendId', ParseIntPipe) firendId: number,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      issuerId: user.id,
      firendId,
    };
    return this.firendsService.deleteFirendById(params);
  }
}
