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
const studentGraphRoute = require('./student.graph.route');
const teacherGraphRoute = require('./teacher.graph.route');
const attendanceRoute = require('./attendance.route');
const learningSession = require('./diksha.etb.learning.session.route');
const allDashboard = require('./all.per.course.prog.route');
const allDashboard2 = require('./alldashboard2');

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
  {
    path: '/studentgraph',
    route: studentGraphRoute,
  },
  {
    path: '/attendance',
    route: attendanceRoute,
  },
  {
    path: '/learningsession',
    route: learningSession,
  },
  {
    path: '/alldashboard',
    route: allDashboard,
  },
  {
    path: '/alldashboard2',
    route: allDashboard2,
  },
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
