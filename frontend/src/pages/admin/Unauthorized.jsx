import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Unauthorized() {
    const location = useLocation();
    const from = location.state?.from || '/admin/dashboard';

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-8 shadow-lg">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Không có quyền truy cập</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Tài khoản của bạn không được cấp quyền để mở trang này.
                </p>
                <div className="mt-6 flex gap-3">
                    <Link
                        to={from}
                        className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                    >
                        Quay lại
                    </Link>
                    <Link
                        to="/admin"
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        Về trang đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}

