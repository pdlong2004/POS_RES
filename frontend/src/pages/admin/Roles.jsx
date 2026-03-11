import React, { useEffect, useMemo, useState } from 'react';
import HeaderAdmin from '@/components/admin/shared/HeaderAdmin';
import SidebarAdmin from '@/components/admin/shared/SidebarAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    createRoleApi,
    deleteRoleApi,
    getAllPermissionsApi,
    getRolePermissionsApi,
    getRolesApi,
    setRolePermissionsApi,
    upsertPermissionApi,
} from '@/service/role.service';

const Roles = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [checked, setChecked] = useState(new Set());
    const [newRoleName, setNewRoleName] = useState('');
    const [newPermCode, setNewPermCode] = useState('');
    const [newPermDesc, setNewPermDesc] = useState('');
    const [error, setError] = useState('');

    const selectedRole = useMemo(() => roles.find((r) => r._id === selectedRoleId) || null, [roles, selectedRoleId]);

    const refresh = async () => {
        setLoading(true);
        setError('');
        try {
            const [rRes, pRes] = await Promise.all([getRolesApi(), getAllPermissionsApi()]);
            const roleData = rRes.data?.data || [];
            const permData = pRes.data?.data || [];
            setRoles(roleData);
            setPermissions(permData);
            if (!selectedRoleId && roleData.length > 0) setSelectedRoleId(roleData[0]._id);
        } catch (e) {
            setError(e?.response?.data?.message || 'Không tải được dữ liệu phân quyền');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const loadRolePerms = async () => {
            if (!selectedRoleId) return;
            setError('');
            try {
                const res = await getRolePermissionsApi(selectedRoleId);
                const ids = res.data?.data?.permissionIds || [];
                setChecked(new Set(ids.map(String)));
            } catch (e) {
                setError(e?.response?.data?.message || 'Không tải được quyền của role');
            }
        };
        loadRolePerms();
    }, [selectedRoleId]);

    const toggle = (permissionId) => {
        setChecked((prev) => {
            const next = new Set(prev);
            const key = String(permissionId);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const save = async () => {
        if (!selectedRoleId) return;
        setSaving(true);
        setError('');
        try {
            await setRolePermissionsApi(selectedRoleId, { permissionIds: Array.from(checked) });
        } catch (e) {
            setError(e?.response?.data?.message || 'Lưu phân quyền thất bại');
        } finally {
            setSaving(false);
        }
    };

    const createRole = async () => {
        const name = newRoleName.trim();
        if (!name) return;
        setError('');
        try {
            const res = await createRoleApi({ name });
            const created = res.data?.data;
            await refresh();
            if (created?._id) setSelectedRoleId(created._id);
            setNewRoleName('');
        } catch (e) {
            setError(e?.response?.data?.message || 'Tạo role thất bại');
        }
    };

    const createPermission = async () => {
        const code = newPermCode.trim();
        if (!code) return;
        setError('');
        try {
            await upsertPermissionApi({ code, description: newPermDesc });
            setNewPermCode('');
            setNewPermDesc('');
            await refresh();
        } catch (e) {
            setError(e?.response?.data?.message || 'Tạo permission thất bại');
        }
    };

    const deleteRole = async () => {
        if (!selectedRoleId) return;
        if (!confirm('Xóa role này?')) return;
        setError('');
        try {
            await deleteRoleApi(selectedRoleId);
            setSelectedRoleId('');
            setChecked(new Set());
            await refresh();
        } catch (e) {
            setError(e?.response?.data?.message || 'Xóa role thất bại');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <HeaderAdmin />
            <div className="flex">
                <SidebarAdmin />
                <main className="flex-1 container mx-auto px-6 py-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-slate-900">Phân quyền</h1>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={refresh} disabled={loading}>
                                Tải lại
                            </Button>
                            <Button onClick={save} disabled={loading || saving || !selectedRoleId}>
                                {saving ? 'Đang lưu...' : 'Lưu quyền'}
                            </Button>
                        </div>
                    </div>

                    {error ? (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {error}
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Role</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-700">Chọn role</label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                        value={selectedRoleId}
                                        onChange={(e) => setSelectedRoleId(e.target.value)}
                                        disabled={loading}
                                    >
                                        {roles.map((r) => (
                                            <option key={r._id} value={r._id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedRole ? (
                                        <p className="text-xs text-slate-500">ID: {selectedRole._id}</p>
                                    ) : null}
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                        placeholder="Tạo role mới (vd: manager)"
                                        disabled={loading}
                                    />
                                    <Button onClick={createRole} disabled={loading || !newRoleName.trim()}>
                                        Tạo
                                    </Button>
                                </div>

                                <Button variant="destructive" onClick={deleteRole} disabled={loading || !selectedRoleId}>
                                    Xóa role
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Permission</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <Input
                                        value={newPermCode}
                                        onChange={(e) => setNewPermCode(e.target.value)}
                                        placeholder="permission code (vd: product:write)"
                                        disabled={loading}
                                    />
                                    <Input
                                        value={newPermDesc}
                                        onChange={(e) => setNewPermDesc(e.target.value)}
                                        placeholder="mô tả"
                                        disabled={loading}
                                    />
                                    <Button onClick={createPermission} disabled={loading || !newPermCode.trim()}>
                                        Thêm permission
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {permissions.map((p) => (
                                        <label
                                            key={p._id}
                                            className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                className="mt-1"
                                                checked={checked.has(String(p._id))}
                                                onChange={() => toggle(p._id)}
                                                disabled={loading || !selectedRoleId}
                                            />
                                            <span className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900">{p.code}</span>
                                                {p.description ? (
                                                    <span className="text-xs text-slate-600">{p.description}</span>
                                                ) : null}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {permissions.length === 0 ? (
                                    <p className="text-sm text-slate-600">Chưa có permission nào. Hãy thêm permission ở trên.</p>
                                ) : null}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Roles;

