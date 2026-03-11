import React, { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import { getStatusTablesApi, createStatusTableApi } from '@/service/statusTable.service';

const AdminStatusTables = () => {
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ code: '', name: '', color: '#cccccc' });

    const fetch = async () => {
        setLoading(true);
        try {
            const res = await getStatusTablesApi();
            setStatuses(res?.data || []);
        } catch (err) {
            console.error('Failed to load statuses', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleCreate = async () => {
        try {
            await createStatusTableApi(form);
            setForm({ code: '', name: '', color: '#cccccc' });
            await fetch();
        } catch (err) {
            console.error('Create status failed', err);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <HeaderAdmin />

            <div className="flex">
                <SidebarAdmin />

                <main className="flex-1 container mx-auto px-6 py-8">
                    <h1 className="text-2xl font-semibold mb-4">Quản lý trạng thái bàn</h1>

                    <div className="mb-6 grid grid-cols-3 gap-2 max-w-md">
                        <input
                            placeholder="Mã (code)"
                            value={form.code}
                            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            placeholder="Tên"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            type="color"
                            value={form.color}
                            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                            className="w-16 h-10"
                        />
                        <div className="col-span-3">
                            <button onClick={handleCreate} className="px-4 py-2 bg-[#F89520] text-white rounded">
                                Tạo trạng thái
                            </button>
                        </div>
                    </div>

                    {loading && <div>Đang tải…</div>}

                    {!loading && (
                        <div className="grid grid-cols-1 gap-2 max-w-md">
                            {statuses.map((s) => (
                                <div key={s._id} className="p-3 border rounded flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">
                                            {s.name} <span className="text-xs text-gray-500">({s.code})</span>
                                        </div>
                                    </div>
                                    <div
                                        style={{ width: 24, height: 24, backgroundColor: s.color }}
                                        className="rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminStatusTables;
