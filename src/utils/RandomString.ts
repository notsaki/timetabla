import crypto from "crypto";

function randomString(): string {
    return crypto.randomBytes(32).toString("hex");
}

export default randomString;
