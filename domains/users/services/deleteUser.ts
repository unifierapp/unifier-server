import Connection from "@/models/Connection";
import ConnectionAccount from "@/models/ConnectionAccount";
import Account from "@/models/Account";
import cloudinary from "@/domains/upload/cloudinary";

export default async function deleteUser(user: Express.User) {
    ConnectionAccount.aggregate([
        {
            $lookup: {
                from: Connection.collection.collectionName,
                localField: "connection",
                foreignField: "_id",
                as: "connection",
            },
        },
        {
            $match: {
                "connection.user": user._id,
            },
        },
        {
            $set: {
                __deleted: true,
            },
        },
        {
            $merge: {
                into: ConnectionAccount.collection.collectionName,
                whenMatched: "merge",
            }
        }
    ]);
    await ConnectionAccount.deleteMany({
        __deleted: true,
    });
    await Connection.deleteMany({
        user: user._id,
    });
    await Account.deleteMany({
        user: user._id,
    });
    if (user.profilePictureCloudId) {
        await cloudinary.destroy(user.profilePictureCloudId);
    }
    await user.deleteOne();
}