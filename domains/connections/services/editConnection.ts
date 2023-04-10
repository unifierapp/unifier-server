import Connection, {IConnection} from "@/models/Connection";
import uploader from "@/domains/upload/cloudinary"
import {NotFoundError} from "@/utils/errors";

interface EditConnectionParameters extends Omit<IConnection, "profileImageUrl" | "profileImageCloudId" | "user"> {
    image?: Express.Multer.File,
}

export default async function editConnection(user: Express.User, id: string, data: EditConnectionParameters) {
    const previousConnection = await Connection.findById(id);
    if (!previousConnection) {
        throw new NotFoundError("Connection not found.");
    }
    const editData: Partial<IConnection> = {
        birthday: data.birthday,
        description: data.description,
        displayName: data.displayName,
    }
    Object.assign(previousConnection, editData);
    const path = data.image?.path;
    if (path) {
        if (previousConnection.profileImageCloudId) {
            await uploader.destroy(previousConnection.profileImageCloudId);
        }
        const result = await uploader.upload(path);
        editData.profileImageUrl = result.secure_url;
        editData.profileImageCloudId = result.public_id;
    }
    return await previousConnection.save();
}
