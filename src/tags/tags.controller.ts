import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { QueryTagDto } from './dto/query-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  } 

  @Get()
  findAll(@Query() query: QueryTagDto) {
    return this.tagsService.findAll(query);
  }
  
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }

  @Post('preset')
  createPreset(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createPreset(createTagDto);
  } 

  @Put('preset/:id')
  updatePreset(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.updatePreset(id, updateTagDto);
  }

  @Delete('preset/:id')
  removePreset(@Param('id') id: string) {
    return this.tagsService.removePreset(id);
  }
}
