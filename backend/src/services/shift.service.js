import Shift from '../../models/Shift.js';
import ShiftAssignment from '../../models/ShiftAssignment.js';
import logService from './log.service.js';

class ShiftService {
    async createShift(adminId, shiftData) {
        const shift = new Shift(shiftData);
        await shift.save();
        await logService.record(adminId, 'CREATE', 'Shift', shift._id, shiftData);
        return shift;
    }

    async getShifts() {
        return await Shift.find();
    }

    async assignShift(adminId, assignmentData) {
        const assignment = new ShiftAssignment(assignmentData);
        await assignment.save();
        await logService.record(adminId, 'CREATE', 'ShiftAssignment', assignment._id, assignmentData);
        return assignment;
    }

    async checkIn(accountId, assignmentId) {
        const assignment = await ShiftAssignment.findOne({ _id: assignmentId, accountId });
        if (!assignment) throw new Error('Assignment not found');

        assignment.checkIn = new Date();
        await assignment.save();

        await logService.record(accountId, 'CHECKIN', 'ShiftAssignment', assignmentId);
        return assignment;
    }

    async checkOut(accountId, assignmentId) {
        const assignment = await ShiftAssignment.findOne({ _id: assignmentId, accountId });
        if (!assignment) throw new Error('Assignment not found');

        assignment.checkOut = new Date();
        assignment.status = 'completed';
        await assignment.save();

        await logService.record(accountId, 'CHECKOUT', 'ShiftAssignment', assignmentId);
        return assignment;
    }

    async autoSchedule(adminId, { startDate, endDate }) {
        // Thuật toán Auto Schedule đơn giản (Heuristic Constraint Satisfaction)
        const shifts = await Shift.find();
        const Employee = (await import('../../models/Employee.js')).default;
        const Account = (await import('../../models/Account.js')).default;
        
        // Chỉ duyệt nhân viên đang hoạt động
        const accounts = await Account.find({ status: true });
        if (accounts.length === 0 || shifts.length === 0) {
            throw new Error('Chưa có nhân viên hoặc ca làm để tự động phân ca');
        }

        const newAssignments = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);

        while (currentDate <= end) {
            // Fix UTC offset issue by formatting using local components
            const y = currentDate.getFullYear();
            const m = String(currentDate.getMonth() + 1).padStart(2, '0');
            const d = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${y}-${m}-${d}`;

            for (const shift of shifts) {
                // Tùy theo thiết kế, mặc định giả định ca này cần 2 người
                const requiredStaff = shift.requiredStaff || 2;
                let staffAssigned = 0;

                // Xáo trộn mảng nhân viên để công bằng hơn (hoặc có thể sort theo số ca ít nhất)
                const shuffledAccounts = [...accounts].sort(() => Math.random() - 0.5);

                for (const acc of shuffledAccounts) {
                    if (staffAssigned >= requiredStaff) break;

                    // Kiểm tra xem nhân viên đã được phân vào CA NÀY trong ngày chưa (tránh trùng y đúc)
                    const existingAssignment = await ShiftAssignment.findOne({
                        accountId: acc._id,
                        shiftId: shift._id,
                        date: dateStr
                    });

                    const conflictInDraft = newAssignments.some(a => 
                        a.accountId.toString() === acc._id.toString() 
                        && a.shiftId.toString() === shift._id.toString() 
                        && a.date === dateStr
                    );

                    // Optional: Kiểm tra nhân viên không quá 2 ca/ngày
                    const caTrongNgayKhac = newAssignments.filter(a => 
                        a.accountId.toString() === acc._id.toString() && a.date === dateStr
                    ).length;

                    if (!existingAssignment && !conflictInDraft && caTrongNgayKhac < 2) {
                        newAssignments.push({
                            accountId: acc._id,
                            shiftId: shift._id,
                            date: dateStr,
                            status: 'scheduled'
                        });
                        staffAssigned++;
                    }
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (newAssignments.length > 0) {
            await ShiftAssignment.insertMany(newAssignments);
            await logService.record(adminId, 'CREATE', 'AutoSchedule', null, { count: newAssignments.length, startDate, endDate });
        }

        return newAssignments;
    }

    async getSchedule(filters = {}) {
        const query = {};
        if (filters.start || filters.end) {
            query.date = {};
            if (filters.start) query.date.$gte = filters.start;
            if (filters.end) query.date.$lte = filters.end;
        }
        return await ShiftAssignment.find(query).populate('accountId', 'name email').populate('shiftId');
    }
}

export default new ShiftService();
