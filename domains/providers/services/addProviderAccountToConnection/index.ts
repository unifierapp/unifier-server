import ConnectionAccount, {IConnectionAccount} from "@/models/ConnectionAccount";
import addProfileToProviderList from "@/domains/providers/services/addProfileToProviderList";
import {AlreadyExistsError} from "@/utils/errors";

export default async function addProviderAccountToConnection(user: Express.User, data: Omit<IConnectionAccount, "user">) {
    const query: Partial<IConnectionAccount> = {
        provider: data.provider,
        providerId: data.providerId,
        user: user._id,
    }
    if (data.endpoint) {
        query.endpoint = data.endpoint;
    }
    const lookup = await ConnectionAccount.findOne(query);
    if (!lookup) {
        throw new AlreadyExistsError("This account has already been registered.");
    }
    await addProfileToProviderList(user, {
        endpoint: query.endpoint,
        provider: data.provider,
    }, [data.providerId]);
    return await ConnectionAccount.create({
        ...data,
        user: user._id,
    });
}