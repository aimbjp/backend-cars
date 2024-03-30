// import nodemailer from 'nodemailer';
//
// interface MailOptions {
//     from: string;
//     to: string;
//     subject: string;
//     html: string;
// }
//
// /**
//  * Отправляет пользователю письмо с кодом восстановления пароля.
//  *
//  * @param email Email пользователя, которому отправляется письмо.
//  * @param token Код восстановления пароля.
//  */
// export const sendResetEmail = async (email: string, token: string): Promise<void> => {
//     // Настройка транспорта nodemailer для использования SMTP НУЖНО НАСТРОИТЬ
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.mailgun.org', // SMTP сервер
//         port: 587, // порт SMTP
//         secure: false, // true для 465 порта, false для других портов
//         auth: {
//             user: 'postmaster@sandboxf3800ae042fd4e7ab4b6e62c60af9da6.mailgun.org', // ваш email
//             pass: 'd49904d72721274da0fbb42d56b77ee3-f68a26c9-2902ec34', // ваш пароль
//         },
//     });
//
//     const resetUrl = `http://localhost:3000/reset-password?token=${token}`; // URL для сброса пароля на фронтенде
//
//     const mailOptions: MailOptions = {
//         from: '"Support" <postmaster@sandboxf3800ae042fd4e7ab4b6e62c60af9da6.mailgun.org>',//aimbjp@gmail.com>', // адрес отправителя
//         to: email, // получатель
//         subject: "Password Reset Request", // тема письма
//         html: `<p>You requested a password reset.</p>
//            <p>Click this <a href="${resetUrl}">link</a> to set a new password.</p>`, // тело письма в формате HTML
//     };
//
//     try {
//         // await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully');
//     } catch (error) {
//         console.error('Failed to send email', error);
//     }
// };


import mailgun from 'mailgun-js';

/**
 * Отправляет пользователю письмо с кодом восстановления пароля.
 *
 * @param email Email пользователя, которому отправляется письмо.
 * @param token Код восстановления пароля.
 */
export const sendResetEmail = async (email: string, token: string): Promise<void> => {
    try {
        // Инициализация Mailgun API
        const mg = mailgun({ apiKey: `${process.env.MAILGUN_API_KEY}`, domain: `${process.env.MAILGUN_DOMAIN}` });

        const resetUrl = `http://pumase.ru/reset-password/${token}`; // URL для сброса пароля на фронтенде

        const data: mailgun.messages.SendData = {
            from: 'Support <aimbjp@gmail.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `Перейдите для восстанолвения ${resetUrl} или скопируйте и вставьте <span>${token}</span>`
        };

        // Отправка письма через Mailgun
        mg.messages().send(data, (error, body) => {
            if (error) {
                console.error('Failed to send email', error);
            } else {
                console.log('Email sent successfully:', body);
            }
        });
    } catch (error) {
        console.error('Failed to send email', error);
    }
};
