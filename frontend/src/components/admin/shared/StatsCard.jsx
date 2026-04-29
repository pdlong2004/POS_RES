import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, change = 0, color = 'primary', icon: Icon }) => {
    const isPositive = change > 0;

    const colorClasses = {
        primary: {
            bg: 'bg-orange-50 dark:bg-orange-950/20',
            text: 'text-orange-600 dark:text-orange-500',
            iconBg: 'bg-orange-600 dark:bg-orange-500',
        },
        success: {
            bg: 'bg-emerald-50 dark:bg-emerald-950/20',
            text: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-600 dark:bg-emerald-500',
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-950/20',
            text: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-600 dark:bg-blue-500',
        },
        warning: {
            bg: 'bg-amber-50 dark:bg-amber-950/20',
            text: 'text-amber-600 dark:text-amber-400',
            iconBg: 'bg-amber-600 dark:bg-amber-500',
        },
    };

    const style = colorClasses[color] || colorClasses.primary;

    return (
        <div className="admin-card p-6 flex flex-col justify-between h-48 relative group">
            <div className="flex justify-between items-start">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                    style.iconBg
                )}>
                    {Icon && <Icon size={24} />}
                </div>
                
                <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    isPositive ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" : "text-rose-600 bg-rose-50 dark:bg-rose-950/20"
                )}>
                    {isPositive ? '+' : ''}{change}%
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
            </div>
        </div>
    );
};

export default StatsCard;

