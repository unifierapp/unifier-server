import ConnectionAccount, {IConnectionAccount} from "@/models/ConnectionAccount";

export default async function addProviderAccountToConnection(user: Express.User, data: Partial<IConnectionAccount>) {
    return await ConnectionAccount.create({
        ...data,
        user: user._id,
    })
}