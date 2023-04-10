import * as mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"
import {Document, PassportLocalSchema, PassportLocalDocument, PassportLocalModel} from "mongoose";

export interface IUser extends PassportLocalDocument {
    email: string,
    displayName: string,
    profilePictureUrl: string,
    profilePictureCloudId: string,
}

interface UserModel<T extends Document> extends PassportLocalModel<T> {
}

const UserSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
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
    }
})

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    passwordFiled: 'password',
});

const User: UserModel<IUser> = mongoose.model<IUser>("User", UserSchema)


export default User;
