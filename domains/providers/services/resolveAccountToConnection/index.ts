import ConnectionAccount from "@/models/ConnectionAccount";
import {IConnection} from "@/models/Connection";
import {HydratedDocument} from "mongoose";

export interface ProviderAccountQuery {
    providerId: string,
    provider: string;
    domain?: string;
}

export default async function resolveProviderAccounts(user: Express.User, queries: ProviderAccountQuery[]) {
    return ConnectionAccount.find({
        user: user._id,
        $or: queries,
    }).populate<{ connection: HydratedDocument<IConnection> }>("connection");
}