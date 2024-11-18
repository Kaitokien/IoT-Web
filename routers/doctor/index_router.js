const systemConfig = require('../../config/system');
const authMiddleware = require('../../middlewares/doctor/auth_middleware');
const dashboardRouters = require('./dashboard_router');
const authRouter = require('./auth_router');
const patientRouter = require('./patientRouter');

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + '/dashboard', 
    authMiddleware.requireAuth, 
    dashboardRouters
  );
  app.use(PATH_ADMIN + '/patient-list', authMiddleware.requireAuth, patientRouter);
  // app.use(PATH_ADMIN + '/deleted-products', authMiddleware.requireAuth, deletedProducts);
  // app.use(PATH_ADMIN + '/products-category', authMiddleware.requireAuth, productCategoryRouter);
  // app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, rolesRouter);
  // app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, accountsRouter);
  app.use(PATH_ADMIN + '/auth', authRouter);
  // app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, myAccountRouter);
  // app.use(PATH_ADMIN + '/settings', authMiddleware.requireAuth, SettingGeneral);
}