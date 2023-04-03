import * as mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"
import {Document, PassportLocalSchema, PassportLocalDocument, PassportLocalModel} from "mongoose";

export interface IUser extends PassportLocalDocument {
    email: string,
    name: {
        first: string,
        last: string,
    },
    profilePictureUrl: string,
    profilePictureCloudId: string,
}

interface UserModel<T extends Document> extends PassportLocalModel<T> {
}

const UserSchema: PassportLocalSchema<IUser, UserModel<IUser>> = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: {
            first: {
                type: String,
                required: true
            },
            last: {
                type: String,
                required: true
            }
        },
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
    usernameField: "email"
})

const User = mongoose.model<IUser>("User", UserSchema)


export default User