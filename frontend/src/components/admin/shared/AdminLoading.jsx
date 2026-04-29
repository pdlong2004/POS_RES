import React from 'react';
import { cn } from '@/lib/utils';

const AdminLoading = ({ message = "Đang xử lý dữ liệu...", fullScreen = false }) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center gap-6",
            fullScreen ? "fixed inset-0 z-[100] bg-white/40 backdrop-blur-xl" : "py-24 w-full"
        )}>
            <div className="relative">
                {/* Outer Rotating Ring */}
                <div className="w-24 h-24 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin" />
                
                {/* Inner Pulsing Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-pulse">
                        <img 
                            src="https://manwah.com.vn/images/logo/manwah.svg" 
                            alt="Manwah" 
                            className="w-8 h-8 object-contain"
                        />
                    </div>
                </div>

                {/* Decorative Glow */}
                <div className="absolute -inset-4 bg-orange-500/10 blur-2xl rounded-full -z-10 animate-pulse" />
            </div>

            <div className="space-y-2 text-center">
                <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] animate-pulse">
                    {message}
                </p>
                <div className="flex items-center justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div 
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminLoading;
