import {
    Schema,
    model,
    PassportLocalSchema,
    PassportLocalModel, PassportLocalDocument,
} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

import * as passport from 'passport';
import {Strategy} from "passport-local";

interface User extends PassportLocalDocument{
    _id: string;
    username: string;
    hash: string;
    salt: string;
    attempts: number;
    last: Date;
}

interface UserModelType extends PassportLocalModel<User> {}

const UserSchema = new Schema<User, UserModelType>({
    username: String,
    hash: String,
    salt: String,
    attempts: Number,
    last: Date,
}) as PassportLocalSchema<User, UserModelType>;

UserSchema.plugin(passportLocalMongoose);

let UserModel: UserModelType = model<User, UserModelType>('User', UserSchema);

passport.use(new Strategy(UserModel.authenticate()));

new UserModel().authenticate
