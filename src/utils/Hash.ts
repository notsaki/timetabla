import crypto from "crypto";

function hash(text: string): string {
    const salt: string = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(text, salt, 1000, 64, "sha512").toString("hex");

    return `${salt}.${hash}`;
}

export default hash;
