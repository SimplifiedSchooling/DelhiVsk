// const passport = require('passport');
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');
// const { roleRights } = require('../config/roles');

// const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
//   if (err || info || !user) {
//     return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
//   }
//   req.user = user;

//   if (requiredRights.length) {
//     const userRights = roleRights.get(user.role);
//     const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
//     if (!hasRequiredRights && req.params.userId !== user.id) {
//       return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
//     }
//   }

//   resolve();
// };

// const auth =
//   (...requiredRights) =>
//   async (req, res, next) => {
//     return new Promise((resolve, reject) => {
//       passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
//     })
//       .then(() => next())
//       .catch((err) => next(err));
//   };

// module.exports = auth;

// const passport = require('passport');
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');

// const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
//   if (err || info || !user) {
//     return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
//   }
//   req.user = user;
//   resolve();
// };

// const auth =
//   () =>
//   async (req, res, next) => {
//     return new Promise((resolve, reject) => {
//       passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
//     })
//       .then(() => next())
//       .catch((err) => next(err));
//   };

// module.exports = auth;

const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  // console.log(req.user);
  if (requiredRights.length) {
    const userRights = req.user.role;
    // const hasRequiredRights = requiredRights[0].includes(userRights);
    const hasRequiredRights = requiredRights.some((requiredRight) => requiredRight.includes(userRights));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }
  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
