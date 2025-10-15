import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Task } from './task.entity';
import { UserRole } from '../types'; // Import the UserRole enum

@Entity('users') // Explicit table name
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  // Use the enum for role type safety in the database
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole;

  @ManyToOne(() => Organization, organization => organization.users)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  organizationId: number;

  @OneToMany(() => Task, task => task.createdBy)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
