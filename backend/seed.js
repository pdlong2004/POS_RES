import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Account from './models/Account.js';
import Role from './models/Role.js';
import Rank from './models/Rank.js';

dotenv.config();

const seedData = async () => {
    try {
        // Kết nối database
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('✅ Đã kết nối database');

        // Xóa dữ liệu cũ
        await Account.deleteMany({});
        await Role.deleteMany({});
        await Rank.deleteMany({});
        console.log('🗑️  Đã xóa dữ liệu cũ');

        // Tạo Roles
        const roles = await Role.insertMany([
            { name: 'Admin', description: 'Quản trị viên hệ thống' },
            { name: 'Manager', description: 'Quản lý nhà hàng' },
            { name: 'Staff', description: 'Nhân viên phục vụ' },
            { name: 'Customer', description: 'Khách hàng' },
        ]);
        console.log('✅ Đã tạo Roles:', roles.map((r) => r.name).join(', '));

        // Tạo Ranks
        const ranks = await Rank.insertMany([
            { name: 'Bronze', description: 'Hạng đồng' },
            { name: 'Silver', description: 'Hạng bạc' },
            { name: 'Gold', description: 'Hạng vàng' },
            { name: 'Diamond', description: 'Hạng kim cương' },
        ]);
        console.log('✅ Đã tạo Ranks:', ranks.map((r) => r.name).join(', '));

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Tạo Accounts
        const accounts = await Account.insertMany([
            {
                name: 'Admin User',
                email: 'admin@pos.com',
                phone: '0123456789',
                password: hashedPassword,
                roleId: roles.find((r) => r.name === 'Admin')._id,
                rankId: ranks.find((r) => r.name === 'Gold')._id,
                point: 1000,
                status: true,
            },
            {
                name: 'Manager User',
                email: 'manager@pos.com',
                phone: '0987654321',
                password: hashedPassword,
                roleId: roles.find((r) => r.name === 'Manager')._id,
                rankId: ranks.find((r) => r.name === 'Silver')._id,
                point: 500,
                status: true,
            },
            {
                name: 'Staff User',
                email: 'staff@pos.com',
                phone: '0111222333',
                password: hashedPassword,
                roleId: roles.find((r) => r.name === 'Staff')._id,
                rankId: ranks.find((r) => r.name === 'Bronze')._id,
                point: 100,
                status: true,
            },
        ]);
        console.log('✅ Đã tạo Accounts:', accounts.map((a) => a.email).join(', '));

        console.log('\n🎉 Seed data thành công!');
        console.log('\n📋 Thông tin đăng nhập:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👤 Admin:');
        console.log('   Email: admin@pos.com');
        console.log('   Password: admin123');
        console.log('\n👤 Manager:');
        console.log('   Email: manager@pos.com');
        console.log('   Password: admin123');
        console.log('\n👤 Staff:');
        console.log('   Email: staff@pos.com');
        console.log('   Password: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi seed data:', error);
        process.exit(1);
    }
};

seedData();
