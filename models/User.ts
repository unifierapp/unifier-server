import mongoose, {
    Schema,
    model,
    PassportLocalSchema,
    PassportLocalModel, PassportLocalDocument,
} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export interface IUser extends PassportLocalDocument{
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    profilePictureUrl: string;
    profilePictureCloudId?: string;
    onboarded: boolean;
    hash?: string;
    salt?: string;
    attempts?: number;
}

interface UserModel extends PassportLocalModel<IUser> {}

const UserSchema = new Schema<IUser, UserModel>({
    email: {
        type: String,
        required: true,
    },
    username: {
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
