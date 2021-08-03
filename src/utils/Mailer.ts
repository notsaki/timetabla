import "dotenv/config";
import nodemailer, { Transporter } from "nodemailer";

export default class Mailer {
    static smtp: string = process.env.EMAIL_SMTP!;
    static port: number = parseInt(process.env.EMAIL_PORT!);
    static username: string = process.env.EMAIL_USERNAME!;
    static from: string = process.env.EMAIL_ADDRESS!;
    static password: string = process.env.EMAIL_PASSWORD!;
    static domain: string = process.env.APP_DOMAIN!;

    private static async sendEmail(to: string, subject: string, text: string, html: string) {
        if (process.env.ENVIRONMENT !== "prod") {
            await nodemailer.createTestAccount();
        } else {
            const transporter: Transporter = nodemailer.createTransport({
                host: this.smtp,
                port: this.port,
                secure: false,
                auth: {
                    user: this.username,
                    pass: this.password,
                },
            });

            try {
                const result = await transporter.sendMail({
                    from: `Timetabla <${this.from}>`,
                    to,
                    subject,
                    text,
                    html,
                });
                console.log("Message sent: %s", result.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
            } catch (error: any) {
                console.log(`Error sending email to ${to}: ${error.response}`);
            }
        }
    }

    static async sendVerificationEmail(receiver: string, receiver_username: string, verificationCode: string) {
        const activationUrl = `${this.domain}/api/user/${receiver_username}/activate/${verificationCode}`;

        await this.sendEmail(
            receiver,
            "Verify your account",
            `Verify your account ${activationUrl}`,
            `<p>Verify your account <a href="${activationUrl}">here</a>.</p>`
        );
    }

    static async sendPasswordResetEmail(receiver: string, receiver_username: string, resetCode: string) {
        const resetPasswordUrl = `${this.domain}/api/user/${receiver_username}/reset/${resetCode}`;

        await this.sendEmail(
            receiver,
            "Reset your password",
            `Reset your password ${resetPasswordUrl}`,
            `<p>Reset your password <a href="${resetPasswordUrl}">here</a>.</p>`
        );
    }
}
