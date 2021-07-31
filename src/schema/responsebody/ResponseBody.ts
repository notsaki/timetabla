class ResponseBody {
    status: number;
    message: string;
    data: any;

    constructor(status: number = 200, message: string = "", data: any = {}) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export default ResponseBody;
