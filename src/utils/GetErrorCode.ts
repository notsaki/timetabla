function getErrorCode(error: any): number {
    return parseInt(error.message.match(/[0-9]+/)[0]);
}

export default getErrorCode;
