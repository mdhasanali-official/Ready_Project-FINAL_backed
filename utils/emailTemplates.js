//utils/emailTemplates.js

const emailTemplates = {
  verificationOTP: (name, otp) => `
    <div style="font-family:Arial;background:#f5f7fb;padding:30px">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;padding:25px;box-shadow:0 5px 15px rgba(0,0,0,0.1)">
        <h2 style="text-align:center;color:#4a4a4a;">
          🔐 Verify Your Email - <span style="color:#4f46e5;">Neterskill</span>
        </h2>
        <p style="font-size:16px;color:#555">
          Hi <strong>${name}</strong>, use the code below to verify your account
        </p>
        <div style="margin:20px 0;padding:15px;background:#4f46e5;border-radius:8px;color:#fff;text-align:center;font-size:24px;letter-spacing:3px;">
          ${otp}
        </div>
        <p style="font-size:14px;color:#777;text-align:center;">
          Code will expire in 10 minutes.
        </p>
        <p style="font-size:14px;color:#777;text-align:center;">
          Neterskill Team 🚀
        </p>
      </div>
    </div>
  `,

  emailVerified: (name) => `
    <div style="font-family:Arial;background:#f5f7fb;padding:30px">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:14px;padding:30px;box-shadow:0 6px 18px rgba(0,0,0,0.12)">
        <h2 style="text-align:center;color:#111;font-size:26px;">
          ✅ Email Verified Successfully
        </h2>
        <p style="font-size:16px;color:#444;text-align:center;">
          Hi <strong>${name}</strong>,<br/>
          Congratulations! Your email has been successfully verified.
        </p>
        <div style="margin:25px 0;padding:18px;background:#4f46e5;border-radius:10px;color:#fff;text-align:center;font-size:16px;">
          Your Neterskill account is now <strong>Active</strong> 🎉
        </div>
        <p style="font-size:14px;color:#666;text-align:center;line-height:22px;">
          You can now login and start learning 🚀
        </p>
        <p style="font-size:13px;color:#888;text-align:center;margin-top:25px;">
          With love ❤️ <br/>
          Neterskill Team
        </p>
      </div>
    </div>
  `,

  resendOTP: (otp) => `
    <div style="font-family:Arial;background:#f5f7fb;padding:30px">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;padding:25px;box-shadow:0 5px 15px rgba(0,0,0,0.1)">
        <h2 style="text-align:center;color:#4a4a4a;">
          🔐 Email Verification Code
        </h2>
        <p style="font-size:16px;color:#555">
          Use the code below to verify your account
        </p>
        <div style="margin:20px 0;padding:15px;background:#4f46e5;border-radius:8px;color:#fff;text-align:center;font-size:24px;letter-spacing:3px;">
          ${otp}
        </div>
        <p style="font-size:14px;color:#777;text-align:center;">
          This code expires in 10 minutes.
        </p>
      </div>
    </div>
  `,
};

module.exports = emailTemplates;