import bcrypt from "bcrypt";

export function hashNew(text: string): string {
    return bcrypt.hashSync(text, parseInt(process.env.PASSWORD_HASH_ROUNDS!));
}

export function verify(hash: string, text: string): boolean {
    return bcrypt.compareSync(hash, text);
}
