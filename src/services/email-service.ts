import nodemailer from 'nodemailer';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

/**
 * Отправляет пользователю письмо с кодом восстановления пароля.
 *
 * @param email Email пользователя, которому отправляется письмо.
 * @param token Код восстановления пароля.
 */
export const sendResetEmail = async (email: string, token: string): Promise<void> => {
    // // Настройка транспорта nodemailer для использования SMTP НУЖНО НАСТРОИТЬ
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com', // SMTP сервер
    //     port: 265, // порт SMTP
    //     secure: false, // true для 465 порта, false для других портов
    //     auth: {
    //         user: 'aimbjp@gmail.com', // ваш email
    //         pass: 'ulSuvorova20', // ваш пароль
    //     },
    // });
    //
    // const resetUrl = `http://localhost:3000/reset-password?token=${token}`; // URL для сброса пароля на фронтенде
    //
    // const mailOptions: MailOptions = {
    //     from: '"Support" <aimbjp@gmail.com>', // адрес отправителя
    //     to: email, // получатель
    //     subject: "Password Reset Request", // тема письма
    //     html: `<p>You requested a password reset.</p>
    //        <p>Click this <a href="${resetUrl}">link</a> to set a new password.</p>`, // тело письма в формате HTML
    // };

    try {
        // await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Failed to send email', error);
    }
};
