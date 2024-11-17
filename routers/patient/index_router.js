const userRouter = require('./user_router');
const dashboardRouter = require('./dashboardRouter');
const patientMiddleware = require('../../middlewares/patient/patient_middleware');

module.exports = (app) => {
  // app.use();
  app.use('/user', patientMiddleware.infoPatient, userRouter);
  app.use('/', dashboardRouter);
}