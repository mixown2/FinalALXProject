/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import { convert } from 'html-to-text';
import pug from 'pug';
import nodemailer from 'nodemailer';
import AppError from '../errors/AppError.js';

export default class Email {
  constructor(user, url) {
    this.name = `${user.firstName} ${user.lastName}`;
    this.to = user.email;
    this.from = process.env.EMAIL;
    this.url = url;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.DEV_EMAIL_HOST,
        port: process.env.DEV_EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.DEV_EMAIL_USERNAME,
          pass: process.env.DEV_EMAIL_PASSWORD,
        },
      });
    }
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.PROD_EMAIL_HOST,
        port: process.env.PROD_EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.PROD_EMAIL_USERNAME,
          pass: process.env.PROD_EMAIL_PASSWORD,
        },
      });
    }
    return new AppError('Something went wrong', 500);
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${process.cwd()}/lib/../views/email/${template}.pug`,
      {
        subject: subject,
        name: this.name,
        url: this.url,
      },
    );

    const text = convert(html);

    const mailOption = {
      from: this.from,
      to: this.to,
      subject,
      text,
      html,
    };

    await this.createTransport().sendMail(mailOption);
  }

  async sendEmailVerification() {
    await this.send('verifyEmail', 'Verify Your Email');
  }

  async sendPasswordRecoveryEmail() {
    await this.send('passwordRecovery', 'Password recovery for WogVoyage');
  }
}
