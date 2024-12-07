import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { QueryTagDto } from './dto/query-tag.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ROLES } from 'src/common/constants/role';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('tags')
@UseGuards(AuthGuard,RolesGuard)
export class TagsController {
  private readonly testUserId = '672ae429e1d74edf0957a98b';
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto, ) {
    return this.tagsService.create(createTagDto);
  } 

  @Get()
  findAll(@Query() query: QueryTagDto) {
    return this.tagsService.findAll({
      ...query,
    });
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, ) {
    return this.tagsService.remove(id);
  }




  // @Post()
  // @Roles(ROLES.NORMAL_USER,ROLES.FINANCIAL_ADMIN,ROLES.SUPER_ADMIN)
  // create(@Body() createTagDto: CreateTagDto, ) {
  //   return this.tagsService.create(createTagDto);
  // } 

  // @Get()
  // findAll(@Query() query: QueryTagDto) {
  //   return this.tagsService.findAll({
  //     ...query,
  //   });
  // }
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
  //   return this.tagsService.update(id, updateTagDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string, ) {
  //   return this.tagsService.remove(id);
  // }
}
