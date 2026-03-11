import TableRoutes from './table.routes.js';
import StatusTableRoutes from './statusTable.routes.js';
import CategoryRoutes from './category.routes.js';
import ProductRoutes from './product.routes.js';
import tableAuthRoute from './tableAuth.route.js';
import orderRoutes from './order.routes.js';
import authRoute from './auth.routes.js';
import statsRoute from './stats.route.js';
import bookingRoutes from './booking.routes.js';
import invoiceRoutes from './invoice.routes.js';
import roleRoutes from './role.routes.js';
import notificationRoutes from './notification.routes.js';
import supplierRoutes from './supplier.routes.js';
import importRoutes from './imports.routes.js';

function routes(app) {
    app.use('/api/tables', TableRoutes);
    app.use('/api/category', CategoryRoutes);
    app.use('/api/products', ProductRoutes);
    app.use('/api/status-tables', StatusTableRoutes);
    app.use('/api/table-auth', tableAuthRoute);
    app.use('/api/orders', orderRoutes);
    app.use('/api/auth', authRoute);
    app.use('/api/stats', statsRoute);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/invoices', invoiceRoutes);
    app.use('/api/roles', roleRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/suppliers', supplierRoutes);
    app.use('/api/imports', importRoutes);
}

export default routes;
