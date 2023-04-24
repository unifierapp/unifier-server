import {IUser} from "@/models/User";

declare module "passport" {
    interface PassportUser extends IUser {}
}

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}

export {};
