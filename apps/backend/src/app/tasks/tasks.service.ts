import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entity';
import { CreateTaskDto, UpdateTaskDto } from '../dto';
import { UserRole } from '../types';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: number,
    userOrgId: number
  ) {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      createdById: userId,
      organizationId: userOrgId,
    });

    return await this.tasksRepository.save(task);
  }

  async findAll(userId: number, userRole: UserRole, userOrgId: number) {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .leftJoinAndSelect('task.organization', 'organization');

    // OWNER can see all tasks. ADMIN and VIEWER are restricted to their organization.
    if (userRole === UserRole.ADMIN || userRole === UserRole.VIEWER) {
      query.where('task.organizationId = :userOrgId', { userOrgId });
    }

    return await query.getMany();
  }

  async findOne(
    id: number,
    userId: number,
    userRole: UserRole,
    userOrgId: number
  ) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['createdBy', 'organization'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Restrict access for ADMIN and VIEWER to their own organization's tasks
    if (
      (userRole === UserRole.ADMIN || userRole === UserRole.VIEWER) &&
      task.organizationId !== userOrgId
    ) {
      throw new ForbiddenException('Access to this task is denied');
    }

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
    userRole: UserRole,
    userOrgId: number
  ) {
    const task = await this.findOne(id, userId, userRole, userOrgId); // findOne already checks for organization access

    // A VIEWER can only update tasks they created themselves.
    if (userRole === UserRole.VIEWER && task.createdById !== userId) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    await this.tasksRepository.update(id, updateTaskDto);
    return this.findOne(id, userId, userRole, userOrgId);
  }

  async remove(
    id: number,
    userId: number,
    userRole: UserRole,
    userOrgId: number
  ) {
    const task = await this.findOne(id, userId, userRole, userOrgId); // findOne already checks for organization access

    // A VIEWER can only delete tasks they created themselves.
    if (userRole === UserRole.VIEWER && task.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.tasksRepository.delete(id);
    return { message: 'Task deleted successfully' };
  }
}
