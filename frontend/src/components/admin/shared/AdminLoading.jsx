import React from 'react';
import { cn } from '@/lib/utils';

const AdminLoading = ({ message = 'Đang tải dữ liệu...', fullScreen = false, className }) => {
    return (
        <div
            className={cn(
                'flex w-full flex-col items-center justify-center bg-white text-slate-900 dark:bg-zinc-950 dark:text-white',
                fullScreen ? 'fixed inset-0 z-[100]' : 'min-h-[280px] py-16',
                className,
            )}
        >
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-orange-100 border-l-orange-600 border-b-orange-500 animate-spin dark:border-orange-950/40 dark:border-l-orange-500 dark:border-b-orange-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-zinc-950">
                        <img src="https://manwah.com.vn/images/logo/manwah.svg" alt="Manwah" className="h-10 w-10 object-contain" />
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-3 text-center">
                <p className="text-sm font-black uppercase tracking-[0.28em] text-slate-800 dark:text-slate-100">
                    {message}
                </p>
                <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="h-2 w-2 rounded-full bg-orange-600 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminLoading;
