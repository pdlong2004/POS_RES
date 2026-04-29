import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Account from './models/Account.js';
import Role from './models/Role.js';
import Rank from './models/Rank.js';
import Supplier from './models/Supplier.js';

dotenv.config({ path: './.env' }); // Assuming it's run from backend/ directory or handled by scripts

const seedData = async () => {
    try {
        // Kết nối database
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('✅ Đã kết nối database');

        // Xóa dữ liệu cũ
        await Account.deleteMany({});
        await Role.deleteMany({});
        await Rank.deleteMany({});
        await Supplier.deleteMany({});
        console.log('🗑️  Đã xóa dữ liệu cũ');

        // Tạo Suppliers
        const suppliers = await Supplier.insertMany([
            {
                name: 'Công ty Thực phẩm Sạch Foodie',
                contactPerson: 'Nguyễn Văn An',
                phone: '0901234567',
                email: 'contact@foodie.vn',
                address: '123 Đường Đông Du, Quận 1, TP.HCM',
                taxCode: '0101234567',
                status: true,
            },
            {
                name: 'Tổng kho Nước giải khát Hưng Thịnh',
                contactPerson: 'Trần Thị Bình',
                phone: '0917654321',
                email: 'sales@hungthinhbeverage.vn',
                address: '456 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
                taxCode: '0107654321',
                status: true,
            },
            {
                name: 'Nông sản Sạch Đà Lạt Garden',
                contactPerson: 'Lê Văn Cường',
                phone: '0983388899',
                email: 'dalatgarden@nongsan.com',
                address: '789 Đường Phan Đình Phùng, TP. Đà Lạt',
                taxCode: '5801234567',
                status: true,
            },
            {
                name: 'Nhà cung cấp Thịt tươi CP',
                contactPerson: 'Phạm Minh Đức',
                phone: '0922334455',
                email: 'cp-supply@market.vn',
                address: '321 Khu công nghiệp Biên Hòa, Đồng Nai',
                taxCode: '3600123456',
                status: true,
            },
            {
                name: 'Hải sản Biển Đông',
                contactPerson: 'Hoàng Hải',
                phone: '0933445566',
                email: 'seafood@biendong.com',
                address: '12 Vũng Tàu, Bà Rịa - Vũng Tàu',
                taxCode: '3500223344',
                status: true,
            },
            {
                name: 'Công ty Bao bì Xanh',
                contactPerson: 'Vũ Thị Hòa',
                phone: '0944556677',
                email: 'greenpack@info.vn',
                address: 'Số 5 Đường Cộng Hòa, Tân Bình, TP.HCM',
                taxCode: '0108899001',
                status: true,
            },
            {
                name: 'Gia vị cao cấp Trung Thành',
                contactPerson: 'Đặng Quốc Vũ',
                phone: '0955667788',
                email: 'sales@trungthanh.vn',
                address: 'Hà Nội',
                taxCode: '0102030405',
                status: true,
            },
            {
                name: 'Sữa tươi Vinamilk',
                contactPerson: 'Trần Thị Liên',
                phone: '0966778899',
                email: 'vinamilk@corp.com',
                address: '10 Tân Trào, Quận 7, TP.HCM',
                taxCode: '0102030406',
                status: true,
            },
            {
                name: 'Bánh kẹo Kinh Đô',
                contactPerson: 'Nguyễn Văn Hải',
                phone: '0977889900',
                email: 'kinhdo@mondelezinternational.com',
                address: 'Bình Dương',
                taxCode: '0102030407',
                status: true,
            },
            {
                name: 'Rượu vang Đà Lạt',
                contactPerson: 'Lê Thị Mai',
                phone: '0988990011',
                email: 'dalatwine@info.vn',
                address: 'Đà Lạt',
                taxCode: '5801234568',
                status: true,
            },
        ]);

        console.log('✅ Đã tạo Suppliers:', suppliers.map((s) => s.name).join(', '));

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
