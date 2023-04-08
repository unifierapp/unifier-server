import ConnectionAccount from "@/models/ConnectionAccount";
import {IConnection} from "@/models/Connection";
import {HydratedDocument} from "mongoose";
import {NotFoundError} from "@/utils/errors";

export interface ProviderAccountQuery {
    providerId: string,
    provider: string;
    domain?: string;
}

export default async function resolveProviderAccount(user: Express.User, query: ProviderAccountQuery) {
    const result = (await ConnectionAccount.findOne({
        user: user._id,
        ...query,
    }).populate<{ connection: HydratedDocument<IConnection> }>("connection"))?.connection;
    if (!result) {
        throw new NotFoundError("Remote account cannot be resolved.");
    }
}
