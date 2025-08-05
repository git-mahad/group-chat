import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/auth/entity/user.entity';
import { UserRole } from 'src/common/enum/user.role.enum';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      const admin = this.userRepository.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log('Admin user created');
    }

    const userExists = await this.userRepository.findOne({
      where: { email: 'user@example.com' },
    });

    if (!userExists) {
      const userPassword = await bcrypt.hash('user123', 10);
      const user = this.userRepository.create({
        name: 'Regular User',
        email: 'user@example.com',
        password: userPassword,
        role: UserRole.USER,
      });
      await this.userRepository.save(user);
      console.log('Regular user created');
    }
  }
}