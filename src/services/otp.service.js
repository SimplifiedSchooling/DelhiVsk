const httpStatus = require('http-status');
const axios = require('axios');
const crypto = require('crypto');
const { Otp } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

class SMSAlert {
    constructor() {
        this.userID = config.SMS.SMS_USERID;
        this.userPwd = '4DgN#F3n8ztVSK';
        this.secureKey = config.SMS.SMS_SECUREKEY;
        this.senderID = config.SMS.SMS_SENDERID;
        this.templateID = config.SMS.SMS_TEMPLETID;

    }

    async sendAdminLoginOTPMsg(otpValue, mobNo) {
        try {
            const moduleName = 'SoSE Admin Web App';
            const message = `OTP for Login with ${moduleName} is ${otpValue} (valid for 5 mins). Do not share this OTP to anyone for security reasons.\n\n-EDUDEL`;

            const result = await this.sendOTPMsg(mobNo, message);
            await createOtp(mobNo, otpValue)
            return result;
        } catch (error) {
                  throw new ApiError(
                    error.response?.status || httpStatus.INTERNAL_SERVER_ERROR,
                    error.message,
                    true,
                    error.stack
                  );
                }
    }
    async sendOTPMsg(mobileNo, message) {
        const smsservicetype = 'otpmsg';

        const encryptedPassword = this.encryptedPassword(this.userPwd);
        const key = this.hashGenerator(this.userID, this.senderID, message, this.secureKey);

        const query = `username=${encodeURIComponent(this.userID)}&password=${encodeURIComponent(encryptedPassword)}&smsservicetype=${encodeURIComponent(smsservicetype)}&content=${encodeURIComponent(message)}&mobileno=${encodeURIComponent(mobileNo)}&senderid=${encodeURIComponent(this.senderID)}&key=${encodeURIComponent(key)}&templateid=${encodeURIComponent(this.templateID)}`;

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

const createOtp = async (mobNumber, otp) => {
  const otpDoc = {
    mobNumber,
    otp,
  };
  Otp.create(otpDoc);
};

const generateOTP = () => {
  const chars = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp += chars[randomIndex];
  }
  return otp;
};


async function getMobileNumberByUserId(userId) {
  const apiUrl = `https://www.edudel.nic.in/vigapi/api/product/${userId}`;

  try {
    const response = await axios.get(apiUrl);
    const mobileData = response.data;

    if (mobileData && mobileData.mobile) {
      return mobileData.mobile;
    } else {
      throw new Error('Mobile number not found for the given user ID.');
    }
  } catch (error) {
    throw new Error(`Error fetching mobile number: ${error.message}`);
  }
};


// const verifyOtp = async (mobNumber, otp) => {
//   const otpDoc = await Otp.find({ mobNumber, otp });
//   if (!otpDoc[0] || !otpDoc[0].otp) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Otp does not match');
//   }
//   await Otp.deleteMany({ mobNumber });
// };

const verifyOtp = async (mobNumber, otp) => {
  const otpDoc = await Otp.find({ mobNumber, otp });
  if (!otpDoc[0] || !otpDoc[0].otp) {
    // Verification failed
    return false;
  }
  await Otp.deleteMany({ mobNumber });

  // Verification successful
  return true;
};


const smsAlert = new SMSAlert();
module.exports = {
    smsAlert,
    createOtp,
    generateOTP,
    getMobileNumberByUserId,
    verifyOtp,
}