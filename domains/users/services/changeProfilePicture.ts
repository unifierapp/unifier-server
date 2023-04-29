import uploader from "@/domains/upload/cloudinary";

export default async function changeProfilePicture(user: Express.User, picture: Express.Multer.File) {
    const result = await uploader.upload(picture.path);
    if (user.profilePictureCloudId) {
        await uploader.destroy(user.profilePictureCloudId);
    }
    user.profilePictureUrl = result.secure_url;
    user.profilePictureCloudId = result.public_id;
    await user.save();
}
