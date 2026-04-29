import React from 'react';
import { Trophy, Image as ImageIcon, MoreHorizontal, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const TopSellers = ({ products, loading }) => {
    if (!products || products.length === 0)
        return (
            <div className="admin-card p-12 flex flex-col items-center justify-center text-center gap-4 bg-white/50 dark:bg-zinc-900/50 border-white/40 dark:border-zinc-800/50 shadow-sm rounded-[2.5rem]">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-200 dark:text-zinc-700">
                    <ShoppingBag size={32} />
                </div>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">Chưa có dữ liệu bán hàng</p>
            </div>
        );

    const formatPrice = (p) => `${Number(p).toLocaleString('vi-VN')}₫`;

    return (
        <div className="admin-card overflow-hidden h-full flex flex-col bg-white/50 dark:bg-zinc-900/50 border-white/40 dark:border-zinc-800/50 shadow-sm rounded-[2.5rem]">
            <div className="px-8 py-6 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                        <Star size={20} className="fill-white" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                        Sản phẩm bán chạy nhất
                    </h3>
                </div>
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-xl transition-all">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="p-8 space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                {products.map((p, index) => (
                    <div key={p._id || index} className="flex items-center gap-5 group transition-all duration-300">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center border-2 border-slate-50 dark:border-zinc-800 shadow-sm overflow-hidden group-hover:border-orange-100 dark:group-hover:border-orange-900 transition-all duration-500">
                                {p.image ? (
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-slate-200 dark:text-zinc-700" />
                                )}
                            </div>
                            <div
                                className={cn(
                                    'absolute -top-2 -left-2 w-7 h-7 rounded-full border-4 border-white dark:border-zinc-900 shadow-md flex items-center justify-center text-[10px] font-black text-white',
                                    index === 0
                                        ? 'bg-orange-500'
                                        : index === 1
                                          ? 'bg-slate-400'
                                          : index === 2
                                            ? 'bg-amber-700'
                                            : 'bg-slate-300',
                                )}
                            >
                                {index + 1}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors line-clamp-1">
                                {p.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] font-black text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {p.totalSold || 0} Đã bán
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                    {formatPrice(p.price || 0)}
                                </span>
                            </div>
                        </div>

                        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 bg-slate-50/30 dark:bg-zinc-800/30 border-t border-slate-50 dark:border-zinc-800">
                <button className="w-full h-14 rounded-2xl text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-500 shadow-sm transition-all border border-transparent hover:border-orange-100 dark:hover:border-orange-900 flex items-center justify-center gap-3 active:scale-95">
                    Xem báo cáo chi tiết <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default TopSellers;
