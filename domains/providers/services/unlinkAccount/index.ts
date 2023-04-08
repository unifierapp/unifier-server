import Account from "@/models/Account";

export default async function unlinkAccount(user: Express.User, config: {
    provider: string;
    domain?: string;
}) {
    const account = await Account.findOne()


}
