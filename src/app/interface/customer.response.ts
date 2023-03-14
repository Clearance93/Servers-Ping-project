import { Server } from "./server";

export interface CustomerResponse {
    timeStamp: number;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developmentMessage: string;
    data: { servers?: Server[], server?: Server }
}