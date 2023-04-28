import mongoose, {
    Schema,
    model,
    PassportLocalSchema,
    PassportLocalModel, PassportLocalDocument,
} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import * as crypto from "crypto";

export interface IUser extends PassportLocalDocument {
    _id: mongoose.Types.ObjectId;
    username: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    newEmail: string;
    profilePictureUrl: string;
    profilePictureCloudId?: string;
    onboarded: boolean;
    emailConfirmationKey?: string;
    hash?: string;
    salt?: string;
    attempts?: number;
}

interface UserModel extends PassportLocalModel<IUser> {
}

const UserSchema = new Schema<IUser, UserModel>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    newEmail: {
        type: String,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailConfirmationKey: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(32).toString("hex"),
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true
    },
    profilePictureUrl: {
        required: true,
        type: String,
        default: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
    },
    profilePictureCloudId: {
        type: String,
    },
    onboarded: {
        type: Boolean,
        default: false,
        required: true,
    },
    hash: String,
    salt: String,
    attempts: Number,
}) as PassportLocalSchema<IUser, UserModel>;

UserSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
});

let User: UserModel = model<IUser, UserModel>('User', UserSchema);
export default User;
