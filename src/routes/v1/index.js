const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const schoolRoute = require('./school.route');
const studentRoute = require('./student.route');
const teacherRoute = require('./teacher.route');
const graphsRoute = require('./graphs.route');
const zonegraphRoute = require('./zonegraph.route');
const teacherGraphRoute = require('./teacher.graph.route');

// const attendanceRoute = require('./attendance.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/school',
    route: schoolRoute,
  },
  {
    path: '/student',
    route: studentRoute,
  },
  {
    path: '/teacher',
    route: teacherRoute,
  },
  {
    path: '/graphs',
    route: graphsRoute,
  },
  {
    path: '/zonegraph',
    route: zonegraphRoute,
  },
  {
    path: '/teacher-graph',
    route: teacherGraphRoute,
  },
  // {
  //   path: '/attendance',
  //   route: attendanceRoute,
  // },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
