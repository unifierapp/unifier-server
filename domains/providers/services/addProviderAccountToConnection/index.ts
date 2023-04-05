import ConnectionAccount, {IConnectionAccount} from "@/models/ConnectionAccount";

export default async function addProviderAccountToConnection(data: Partial<IConnectionAccount>) {
    return await ConnectionAccount.create({...data})
}