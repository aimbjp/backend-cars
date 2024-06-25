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
