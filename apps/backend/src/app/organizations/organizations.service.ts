import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository, IsNull } from 'typeorm';
import { Organization } from '../entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: TreeRepository<Organization>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = this.organizationsRepository.create(
      createOrganizationDto,
    );

    if (createOrganizationDto.parentId) {
      const parent = await this.organizationsRepository.findOneBy({
        id: createOrganizationDto.parentId,
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent organization with ID ${createOrganizationDto.parentId} not found`,
        );
      }
      organization.parent = parent;
    }

    return this.organizationsRepository.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationsRepository.find({
      relations: ['parent', 'users'],
    });
  }

  async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationsRepository.findOne({
      where: { id },
      relations: ['parent', 'users'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  async findTree(): Promise<Organization[]> {
    return this.organizationsRepository.findTrees();
  }

  async findDescendants(id: number): Promise<Organization> {
    const organization = await this.findOne(id);
    return this.organizationsRepository.findDescendantsTree(organization);
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findOne(id);
    this.organizationsRepository.merge(organization, updateOrganizationDto);

    if (updateOrganizationDto.parentId) {
        const parent = await this.findOne(updateOrganizationDto.parentId);
        organization.parent = parent;
    } else if (updateOrganizationDto.parentId === null) {
        organization.parent = null;
    }


    return this.organizationsRepository.save(organization);
  }

  async remove(id: number): Promise<void> {
    const result = await this.organizationsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
  }
}
