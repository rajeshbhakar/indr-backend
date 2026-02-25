const otpStore = new Map();

const setOTP = (mobile, otp) => {
  otpStore.set(mobile, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 min expiry
  });
};

const verifyOTP = (mobile, otp) => {
  const data = otpStore.get(mobile);
  if (!data) return false;

  if (Date.now() > data.expiresAt) {
    otpStore.delete(mobile);
    return false;
  }

  if (data.otp !== otp) return false;

  otpStore.delete(mobile);
  return true;
};

module.exports = { setOTP, verifyOTP };