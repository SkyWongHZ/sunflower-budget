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
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tags')
// @UseGuards(AuthGuard)
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tagsService.findOne(+id);
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, ) {
    return this.tagsService.remove(id);
  }
}
