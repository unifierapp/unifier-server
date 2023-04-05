import mongoose from "mongoose";

export interface IConnection {
    user: mongoose.Types.ObjectId;
    displayName: string;
    birthday?: Date;
    profileImageUrl: string;
    profileImageCloudId?: string;
    description?: string;
}

const ConnectionSchema = new mongoose.Schema<IConnection>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    displayName: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
    },
    profileImageUrl: {
        type: String,
        required: true,
        default: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
    },
    profileImageCloudId: {
        type: String,
    },
    description: {
        type: String,
    },
})

const Connection = mongoose.model<IConnection>('Connection', ConnectionSchema);

export default Connection;