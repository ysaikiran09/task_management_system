import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AccessControlGuard } from '../auth';
import { PermissionActions } from '../types';
import { Permissions } from '../decorators';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dto';

@Controller('organizations')
@UseGuards(AccessControlGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Permissions(PermissionActions.MANAGE_USERS)
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @Permissions(PermissionActions.READ)
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get('tree')
  @Permissions(PermissionActions.READ)
  findTree() {
    return this.organizationsService.findTree();
  }

  @Get(':id')
  @Permissions(PermissionActions.READ)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findOne(id);
  }

  @Get(':id/descendants')
  @Permissions(PermissionActions.READ)
  findDescendants(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findDescendants(id);
  }

  @Put(':id')
  @Permissions(PermissionActions.MANAGE_USERS)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @Permissions(PermissionActions.MANAGE_USERS)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.remove(id);
  }
}
