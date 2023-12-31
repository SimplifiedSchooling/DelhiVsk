const httpStatus = require('http-status');
const axios = require('axios');
const crypto = require('crypto');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} userName
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (userName, password) => {
  const user = await userService.getUserByEmail(userName);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

// Your SMS API credentia
class SMSAlert {
  constructor() {
    this.userID = 'edudel-vsk';
    this.userPwd = '4DgN#F3n8ztVSK';
    this.secureKey = '2b3c172f-7dbb-4a28-aa9c-07c5eb770f6b';
    this.senderID = 'EDUDEL';
    this.templateID = '1007059202141973277';
  }

  async sendAdminLoginOTPMsg(otpValue, mobNo) {
    try {
      const moduleName = 'SoSE Admin Web App';
      const message = `OTP for Login with ${moduleName} is ${otpValue} (valid for 5 mins). Do not share this OTP to anyone for security reasons.\n\n-EDUDEL`;

      const result = await this.sendOTPMsg(mobNo, message);
      console.log(result);
    } catch (error) {
      console.error(`Error sending OTP: ${error.message}`);
    }
  }

  async sendOTPMsg(mobileNo, message) {
    const smsservicetype = 'otpmsg';

    const encryptedPassword = this.encryptedPassword(this.userPwd);
    const key = this.hashGenerator(this.userID, this.senderID, message, this.secureKey);

    const query = `username=${encodeURIComponent(this.userID)}&password=${encodeURIComponent(
      encryptedPassword
    )}&smsservicetype=${encodeURIComponent(smsservicetype)}&content=${encodeURIComponent(
      message
    )}&mobileno=${encodeURIComponent(mobileNo)}&senderid=${encodeURIComponent(this.senderID)}&key=${encodeURIComponent(
      key
    )}&templateid=${encodeURIComponent(this.templateID)}`;

    const response = await axios.post('https://msdgweb.mgov.gov.in/esms/sendsmsrequestDLT', query, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  encryptedPassword(password) {
    const encPwd = Buffer.from(password, 'utf-8');
    const sha1 = crypto.createHash('sha1');
    const pp = sha1.update(encPwd).digest();
    return pp.toString('hex');
  }

  hashGenerator(username, senderID, message, secureKey) {
    const data = `${username}${senderID}${message}${secureKey}`;
    const genKey = Buffer.from(data, 'utf-8');
    const sha512 = crypto.createHash('sha512');
    const secKey = sha512.update(genKey).digest();
    return secKey.toString('hex');
  }
}

// Example usage
// const smsAlert = new SMSAlert();
// smsAlert.sendAdminLoginOTPMsg('123456', '9823525745');

// Utility functions
// const encryptedPassword = (password) => {

//   const sha1 = crypto.createHash('sha1');
//   const hash = sha1.update(password, 'utf-8').digest('hex');
//   return hash;
// };

// const hashGenerator = (username, senderID, message, secureKey) => {
//     const data = `${username}${senderID}${message}${secureKey}`;
//     const sha512 = crypto.createHash('sha512');
//     const hash = sha512.update(data, 'utf-8').digest('hex');
//     return hash;
// };

// // SMS sending route
// const smsVerification =  async(req, res) => {
//     try {
//         const { username, password, senderid, mobileNo, message, templateid } = req.body;

//         // Encrypted password and secure key
//         const encryptedPwd = encryptedPassword(password);
//         const newSecureKey = hashGenerator(username.trim(), senderid.trim(), message.trim(), secureKey.trim());

//         // SMS service endpoint
//         const smsEndpoint = 'https://msdgweb.mgov.gov.in/esms/sendsmsrequestDLT';

//         // Constructing the SMS request
//         const requestData = {
//             username: encodeURIComponent(username.trim()),
//             password: encodeURIComponent(encryptedPwd),
//             smsservicetype: 'singlemsg',
//             content: encodeURIComponent(message.trim()),
//             mobileno: encodeURIComponent(mobileNo),
//             senderid: encodeURIComponent(senderid.trim()),
//             key: encodeURIComponent(newSecureKey.trim()),
//             templateid: encodeURIComponent(templateid.trim()),
//         };

//         const response = await axios.post(smsEndpoint, null, { params: requestData });

//         // Send the response from the SMS service to the client
//         res.json({ status: response.status, data: response.data });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
