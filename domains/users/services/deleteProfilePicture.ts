import uploader from "@/domains/upload/cloudinary";

export default async function deleteProfilePicture(user: Express.User) {
    const oldId = user.profilePictureCloudId;
    user.profilePictureUrl = undefined;
    user.profilePictureCloudId = undefined;
    console.log(user);
    await user.save();
    if (oldId) {
        await uploader.destroy(oldId);
    }
}
