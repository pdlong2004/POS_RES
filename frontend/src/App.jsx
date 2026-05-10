import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/admin/shared/ProtectedRoute';
import ScrollToTop from './components/ui/ScrollToTop';
import AdminLoading from './components/admin/shared/AdminLoading';

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
const StaffHome = lazy(() => import('./pages/client').then((m) => ({ default: m.StaffHome })));
const CustomerLanding = lazy(() => import('./pages/client').then((m) => ({ default: m.CustomerLanding })));

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

const LoadingScreen = () => <AdminLoading fullScreen message="Đang tải ứng dụng..." />;

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
                                    <Route path="/" element={<CustomerLanding />} />
                                    <Route path="/home" element={<Home />} />
                                    <Route
                                        path="/staff"
                                        element={
                                            <ProtectedRoute allowedRoles={['admin', 'cashier', 'waiter', 'chef', 'staff']}>
                                                <StaffHome />
                                            </ProtectedRoute>
                                        }
                                    />
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
