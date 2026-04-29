import React from 'react';
import HeaderAdmin from './HeaderAdmin';
import SidebarAdmin from './SidebarAdmin';
import { cn } from '@/lib/utils';

const AdminLayout = ({ children, className }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 admin-body text-slate-900 dark:text-slate-100 selection:bg-orange-500/30 transition-colors duration-500">
            <HeaderAdmin />

            <div className="flex">
                <SidebarAdmin />

                <main className={cn(
                    "flex-1 admin-content-padding max-w-[1600px] mx-auto overflow-hidden",
                    className
                )}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

