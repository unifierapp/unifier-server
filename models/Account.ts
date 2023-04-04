import mongoose from "mongoose";


export interface IAccount {
    user: mongoose.Types.ObjectId,
    providerAccountId: string,
    provider: string,
    providerDomain?: string,
    accessToken: string,
    accessTokenSecret?: string,
    refreshToken?: string,
    displayName: string,
    userName: string,
}

const AccountSchema = new mongoose.Schema<IAccount>({
    user: {
        types: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    providerAccountId: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    providerDomain: {
        type: String,
    },
    accessToken: {
        type: String,
        required: true,
    },
    accessTokenSecret: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    displayName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
})

const Account = mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
