import Account from '../../models/Account.js';
import Employee from '../../models/Employee.js';
import bcrypt from 'bcryptjs';
import logService from './log.service.js';

class StaffService {
    async createStaff(adminId, staffData) {
        const { name, email, password, phone, roleId, position, salary } = staffData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const account = new Account({
            name,
            email,
            password: hashedPassword,
            phone,
            roleId,
            status: true
        });
        
        const savedAccount = await account.save();
        
        const employee = new Employee({
            accountId: savedAccount._id,
            position,
            salary
        });
        
        await employee.save();
        
        await logService.record(adminId, 'CREATE', 'Staff', savedAccount._id, { name, roleId });
        
        return savedAccount;
    }

    async updateStaff(adminId, id, updateData) {
        try {
            const { name, email, phone, roleId, position, salary, status } = updateData;
            
            console.log('Updating staff:', id, updateData);

            const account = await Account.findByIdAndUpdate(id, {
                name, 
                email, 
                phone, 
                roleId: roleId || undefined, 
                status: status !== undefined ? status : true
            }, { new: true });
            
            if (!account) throw new Error('Không tìm thấy tài khoản');

            // Find or create employee info
            await Employee.findOneAndUpdate(
                { accountId: id }, 
                { position, salary },
                { upsert: true, new: true }
            );
            
            await logService.record(adminId, 'UPDATE', 'Staff', id, updateData);
            
            return account;
        } catch (error) {
            console.error('Error in StaffService.updateStaff:', error);
            throw error;
        }
    }

    async deleteStaff(adminId, id) {
        await Account.findByIdAndDelete(id);
        await Employee.findOneAndDelete({ accountId: id });
        
        await logService.record(adminId, 'DELETE', 'Staff', id);
        
        return true;
    }

    async getAllStaff() {
        // Find all accounts that are employees (have an entry in Employee model or based on role)
        // For simplicity, let's get all accounts and their employee details
        const accounts = await Account.find().populate('roleId');
        const staffList = [];
        
        for (const acc of accounts) {
            const emp = await Employee.findOne({ accountId: acc._id });
            staffList.push({
                ...acc.toObject(),
                employeeInfo: emp
            });
        }
        
        return staffList;
    }
}

export default new StaffService();
