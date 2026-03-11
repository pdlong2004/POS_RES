import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { Home, Orders, Menu, AboutUs, Booking, Invoice } from './pages/client';
import TableLogin from './pages/client/TableLogin';
import ScanQR from './pages/client/ScanQR';
import {
    Login,
    Dashboard,
    Orders as AdminOrders,
    AdminTables,
    AdminStatusTables,
    AdminProducts,
    AdminBookings,
    Unauthorized,
    Roles,
    AdminInventory,
    AdminSuppliers,
    AdminImports,
    AdminReports,
    AdminCategories,
    AdminProfile,
    AdminSettings,
} from './pages/admin';
import ProtectedRoute from './components/admin/shared/ProtectedRoute';
import ScrollToTop from './components/ui/ScrollToTop';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <CartProvider>
                        <ScrollToTop />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/menu" element={<Menu />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/scan" element={<ScanQR />} />
                            <Route path="/table-login/:id" element={<TableLogin />} />
                            <Route path="/booking" element={<Booking />} />
                            <Route path="/admin" element={<Login />} />
                            <Route path="/admin/unauthorized" element={<Unauthorized />} />

                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/orders"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminOrders />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/tables"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminTables />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/status-tables"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminStatusTables />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/products"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminProducts />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/inventory"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminInventory />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/bookings"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminBookings />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/roles"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Roles />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/suppliers"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminSuppliers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/imports"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminImports />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/reports"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminReports />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/categories"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminCategories />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/profile"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminProfile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/settings"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminSettings />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </CartProvider>
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
