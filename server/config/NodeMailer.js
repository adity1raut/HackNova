import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'araut7798@gmail.com',
      pass: 'dlop caea mcjn zgyo',
  }
});

export default transporter;