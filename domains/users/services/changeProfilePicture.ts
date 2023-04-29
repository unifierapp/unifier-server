import uploader from "@/domains/upload/cloudinary";
import * as fs from "fs";

export default async function changeProfilePicture(user: Express.User, picture: Express.Multer.File) {
    const result = await uploader.upload(picture.path);
    console.log(picture.path, result);
    await fs.promises.rm(picture.path);
    if (user.profilePictureCloudId) {
        await uploader.destroy(user.profilePictureCloudId);
    }
    user.profilePictureUrl = result.secure_url;
    user.profilePictureCloudId = result.public_id;
    await user.save();
}
