import Connection, {IConnection} from "@/models/Connection";
import uploader from "@/domains/upload/cloudinary"

interface AddConnectionParameters extends Omit<IConnection, "profileImageUrl" | "profileImageCloudId"> {
    image?: Express.Multer.File,
}

export default async function addConnection(data: AddConnectionParameters) {
    const insertData: Partial<IConnection> = {
        user: data.user,
        birthday: data.birthday,
        description: data.description,
        displayName: data.displayName,
    }
    const path = data.image?.path;
    if (path) {
        const result = await uploader.upload(path);
        insertData.profileImageUrl = result.secure_url;
        insertData.profileImageCloudId = result.public_id;
    }
    return await Connection.create(insertData);
}
