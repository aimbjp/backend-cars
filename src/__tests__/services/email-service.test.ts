import mailgun from 'mailgun-js';
import { sendResetEmail } from '../../services/email-service';

jest.mock('mailgun-js');

describe('sendResetEmail', () => {
    const email = 'test@example.com';
    const token = 'resettoken';
    const apiKey = 'fake-api-key';
    const domain = 'fake-domain';
    const mockMailgun = {
        messages: jest.fn().mockReturnThis(),
        send: jest.fn((data, callback) => {
            callback(null, { message: 'Email sent successfully' });
        }),
    };

    beforeAll(() => {
        process.env.MAILGUN_API_KEY = apiKey;
        process.env.MAILGUN_DOMAIN = domain;
        (mailgun as jest.Mock).mockReturnValue(mockMailgun);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send a reset email successfully', async () => {
        await sendResetEmail(email, token);

        expect(mailgun).toHaveBeenCalledWith({ apiKey, domain });
        expect(mockMailgun.messages).toHaveBeenCalled();
        expect(mockMailgun.send).toHaveBeenCalledWith(
            {
                from: 'Support <aimbjp@gmail.com>',
                to: email,
                subject: 'Password Reset Request',
                html: `Перейдите для восстанолвения http://pumase.ru/reset-password/${token} или скопируйте и вставьте <span>${token}</span>`,
            },
            expect.any(Function)
        );
    });

    it('should handle email sending failure', async () => {
        mockMailgun.send.mockImplementationOnce((data, callback) => {
            callback(new Error('Failed to send email'), null);
        });

        console.error = jest.fn();

        await sendResetEmail(email, token);

        expect(console.error).toHaveBeenCalledWith('Failed to send email', new Error('Failed to send email'));
    });
});
