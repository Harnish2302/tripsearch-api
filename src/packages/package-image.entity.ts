import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Package } from './package.entity';

@Entity({ name: 'package_images' })
export class PackageImage {
  @PrimaryGeneratedColumn({ name: 'image_id' })
  id: number;

  @Column({ name: 'image_url', length: 512 })
  imageUrl: string;

  @Column({ name: 'alt_text', nullable: true })
  altText: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'uploaded_at', type: 'timestamp' })
  uploadedAt: Date;
  
  @Column({ name: 'package_id' })
  packageId: number;

  @ManyToOne(() => Package, (pkg: Package) => pkg.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' })
  package: Package;
}