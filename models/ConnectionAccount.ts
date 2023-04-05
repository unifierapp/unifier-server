import mongoose from "mongoose";

export interface IConnectionAccount {
    connection: mongoose.Types.ObjectId,
    provider: string,
    domain?: string,
    providerId: string,
}

const ConnectionAccountSchema = new mongoose.Schema<IConnectionAccount>({
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Connection",
    },
    domain: {
        type: String,
    },
    providerId: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    }
});

const ConnectionAccount = mongoose.model("ConnectionAccount", ConnectionAccountSchema);

export default ConnectionAccount;