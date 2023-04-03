import {IUser} from "@/models/User";
import {HydratedDocument} from "mongoose";


declare module "passport" {
    interface PassportUser extends HydratedDocument<IUser> {
    }
}

declare global {
    namespace Express {
        interface User extends HydratedDocument<IUser> {
        }
    }
}

export {};