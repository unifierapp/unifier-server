import {IUser} from "@/models/User";
import mongoose, {HydratedDocument} from "mongoose";


declare module "passport" {
    interface PassportUser extends HydratedDocument<IUser> {
        _id: mongoose.Types.ObjectId
    }
}

declare global {
    namespace Express {
        interface User extends HydratedDocument<IUser> {
            _id: mongoose.Types.ObjectId
        }
    }
}

export {};