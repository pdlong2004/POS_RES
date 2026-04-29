import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/admin/shared/ProtectedRoute';
import ScrollToTop from './components/ui/ScrollToTop';
import { Loader2 } from 'lucide-react';

// ========================
// 🚀 PERFORMANCE: LAZY LOADING
// All page components are loaded only when needed, reducing initial bundle size.
// ========================

// Client Pages
const Home = lazy(() => import('./pages/client').then((m) => ({ default: m.Home })));
const Orders = lazy(() => import('./pages/client').then((m) => ({ default: m.Orders })));
const Menu = lazy(() => import('./pages/client').then((m) => ({ default: m.Menu })));
const AboutUs = lazy(() => import('./pages/client').then((m) => ({ default: m.AboutUs })));
const Booking = lazy(() => import('./pages/client').then((m) => ({ default: m.Booking })));
const Invoice = lazy(() => import('./pages/client').then((m) => ({ default: m.Invoice })));
const PaymentResult = lazy(() => import('./pages/client').then((m) => ({ default: m.PaymentResult })));
const TableLogin = lazy(() => import('./pages/client/TableLogin'));
const ScanQR = lazy(() => import('./pages/client/ScanQR'));

// Admin Pages
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminTables = lazy(() => import('./pages/admin/AdminTables'));

const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const Unauthorized = lazy(() => import('./pages/admin/Unauthorized'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminSuppliers = lazy(() => import('./pages/admin/AdminSuppliers'));
const AdminImports = lazy(() => import('./pages/admin/AdminImports'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const StaffManagement = lazy(() => import('./pages/admin/StaffManagement'));
const ShiftManagement = lazy(() => import('./pages/admin/ShiftManagement'));
const StaffSchedule = lazy(() => import('./pages/admin/StaffSchedule'));
const AttendanceManagement = lazy(() => import('./pages/admin/AttendanceManagement'));

// Global Loading Fallback
const LoadingScreen = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-slate-900">
        <div className="relative">
            {/* Outer Ring */}
            <div className="w-20 h-20 rounded-full border-4 border-orange-50 animate-spin border-t-orange-600" />
            
            {/* Inner Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-pulse">
                    <img 
                        src="https://manwah.com.vn/images/logo/manwah.svg" 
                        alt="Manwah" 
                        className="w-6 h-6 object-contain"
                    />
                </div>
            </div>
            
            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-orange-500/10 blur-2xl rounded-full -z-10 animate-pulse" />
        </div>
        <div className="mt-8 text-center space-y-2">
            <p className="text-slate-900 font-black uppercase tracking-[0.3em] text-[11px] animate-pulse">
                Đang tải ứng dụng...
            </p>
            <div className="flex justify-center gap-1.5">
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

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <ToastProvider>
                        <CartProvider>
                            <ScrollToTop />
                            <Suspense fallback={<LoadingScreen />}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/orders" element={<Orders />} />
                                    <Route path="/menu" element={<Menu />} />
                                    <Route path="/about" element={<AboutUs />} />
                                    <Route path="/scan" element={<ScanQR />} />
                                    <Route path="/table-login/:id" element={<TableLogin />} />
                                    <Route path="/booking" element={<Booking />} />
                                    <Route path="/invoice" element={<Invoice />} />
                                    <Route path="/payment-result" element={<PaymentResult />} />
                                    <Route path="/admin" element={<Login />} />
                                    <Route path="/admin/unauthorized" element={<Unauthorized />} />

                                    {/* Admin Protected Routes */}
                                    {[
                                        {
                                            path: '/admin/dashboard',
                                            element: <Dashboard />,
                                            roles: ['admin', 'cashier', 'waiter', 'chef', 'staff'],
                                        },
                                        {
                                            path: '/admin/orders',
                                            element: <AdminOrders />,
                                            roles: ['admin', 'cashier', 'waiter', 'chef', 'staff'],
                                        },
                                        {
                                            path: '/admin/tables',
                                            element: <AdminTables />,
                                            roles: ['admin', 'cashier', 'waiter', 'chef', 'staff'],
                                        },

                                        {
                                            path: '/admin/products',
                                            element: <AdminProducts />,
                                            roles: ['admin', 'cashier', 'waiter', 'chef', 'staff'],
                                        },
                                        {
                                            path: '/admin/inventory',
                                            element: <AdminInventory />,
                                            roles: ['admin', 'cashier', 'waiter', 'chef', 'staff'],
                                        },
                                        { path: '/admin/bookings', element: <AdminBookings />, roles: ['admin'] },
                                        { path: '/admin/suppliers', element: <AdminSuppliers />, roles: ['admin'] },
                                        { path: '/admin/imports', element: <AdminImports />, roles: ['admin'] },
                                        { path: '/admin/reports', element: <AdminReports />, roles: ['admin'] },
                                        { path: '/admin/categories', element: <AdminCategories />, roles: ['admin'] },
                                        { path: '/admin/profile', element: <AdminProfile />, roles: ['admin'] },
                                        { path: '/admin/settings', element: <AdminSettings />, roles: ['admin'] },
                                        { path: '/admin/staff', element: <StaffManagement />, roles: ['admin'] },
                                        {
                                            path: '/admin/shifts',
                                            element: <ShiftManagement />,
                                            roles: ['admin', 'cashier', 'waiter', 'chef', 'staff'],
                                        },
                                        {
                                            path: '/admin/attendance',
                                            element: <AttendanceManagement />,
                                            roles: ['admin'],
                                        },
                                        {
                                            path: '/admin/my-schedule',
                                            element: <StaffSchedule />,
                                            roles: ['admin', 'cashier', 'waiter', 'chef', 'staff'],
                                        },
                                    ].map((route) => (
                                        <Route
                                            key={route.path}
                                            path={route.path}
                                            element={
                                                <ProtectedRoute allowedRoles={route.roles}>
                                                    {route.element}
                                                </ProtectedRoute>
                                            }
                                        />
                                    ))}
                                </Routes>
                            </Suspense>
                        </CartProvider>
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;

