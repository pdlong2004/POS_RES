import React from 'react';
import { cn } from '@/lib/utils';

const StatsCard = ({ title, value, change = 0, color = 'primary' }) => {
    const isPositive = change > 0;

    const colorClasses = {
        primary: {
            ring: 'stroke-red-500',
            text: 'text-red-500',
        },
        accent: {
            ring: 'stroke-amber-500',
            text: 'text-amber-500',
        },
        orange: {
            ring: 'stroke-orange-500',
            text: 'text-orange-500',
        },
    };

    const colors = colorClasses[color] || colorClasses.primary;

    const percentage = Math.min(Math.abs(change), 100);
    const circumference = 2 * Math.PI * 26;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-card rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
                <p className="text-muted-foreground text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-card-foreground mt-1">{value}</p>
            </div>

            <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        className="text-muted/50"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        strokeWidth="5"
                        strokeLinecap="round"
                        className={colors.ring}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 0.5s ease',
                        }}
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn('text-xs font-semibold', colors.text)}>
                        {isPositive ? '+' : ''}
                        {change}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
