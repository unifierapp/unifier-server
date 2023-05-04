import mongoose from "mongoose";

export interface IConnectionAccount {
    user: mongoose.Types.ObjectId,
    connection: mongoose.Types.ObjectId,
    provider: string,
    endpoint?: string,
    providerId: string,
    __deleted?: boolean,
}

const ConnectionAccountSchema = new mongoose.Schema<IConnectionAccount>({
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Connection",
    },
    endpoint: {
        type: String,
    },
    providerId: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    __deleted: Boolean,
});

const ConnectionAccount = mongoose.model<IConnectionAccount>("ConnectionAccount", ConnectionAccountSchema);
export default ConnectionAccount;