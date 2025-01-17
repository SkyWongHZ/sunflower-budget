import {
  Controller,
  Get,
  Post,
  Put,
  Body,
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
  create(@Body() createTagDto: CreateTagDto, @Request() req:any) {
    return this.tagsService.create(createTagDto,req.user.id);
  } 

  @Get()
  findAll(@Query() query: QueryTagDto,@Request() req:any) {
    return this.tagsService.findAll({
      ...query,
      userId: req.user.id,
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




  @Post('preset')
  @Roles(ROLES.FINANCIAL_ADMIN,ROLES.SUPER_ADMIN)
  createPreset(@Body() createTagDto: CreateTagDto, ) {
    return this.tagsService.createPreset(createTagDto);
  } 

  @Put('preset/:id')
  @Roles(ROLES.FINANCIAL_ADMIN,ROLES.SUPER_ADMIN)
  updatePreset(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.updatePreset(id, updateTagDto);
  }

  @Delete('preset/:id')
  @Roles(ROLES.SUPER_ADMIN)
  removePreset(@Param('id') id: string, ) {
    return this.tagsService.removePreset(id);
  }
}
