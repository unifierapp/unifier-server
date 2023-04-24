import Account from "@/models/Account";

export default async function getProviders(user: Express.User) {
    return Account.find({
        user: user._id,
    });
}