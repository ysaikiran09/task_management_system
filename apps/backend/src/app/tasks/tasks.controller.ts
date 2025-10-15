import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../dto';
import { AccessControlGuard } from '../auth';
import { Permissions } from '../decorators';
import { PermissionActions } from '../types';

@Controller('tasks')
@UseGuards(AccessControlGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Permissions(PermissionActions.CREATE)
  @UsePipes(new ValidationPipe({ whitelist: true })) // Add validation pipe
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.tasksService.create(
      createTaskDto,
      req.user.userId,
      req.user.organizationId,
    );
  }

  @Get()
  @Permissions(PermissionActions.READ)
  findAll(@Req() req) {
    return this.tasksService.findAll(
      req.user.userId,
      req.user.role,
      req.user.organizationId,
    );
  }

  @Get(':id')
  @Permissions(PermissionActions.READ)
  findOne(@Param('id') id: string, @Req() req) {
    return this.tasksService.findOne(
      +id,
      req.user.userId,
      req.user.role,
      req.user.organizationId,
    );
  }

  @Put(':id')
  @Permissions(PermissionActions.UPDATE)
  @UsePipes(new ValidationPipe({ whitelist: true })) // Add validation pipe
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.update(
      +id,
      updateTaskDto,
      req.user.userId,
      req.user.role,
      req.user.organizationId,
    );
  }

  @Delete(':id')
  @Permissions(PermissionActions.DELETE)
  remove(@Param('id') id: string, @Req() req) {
    return this.tasksService.remove(
      +id,
      req.user.userId,
      req.user.role,
      req.user.organizationId,
    );
  }
}
