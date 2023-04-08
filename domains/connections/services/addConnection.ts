import Connection, {IConnection} from "@/models/Connection";

interface AddConnectionParameters extends Omit<IConnection, "profileImageUrl" | "profileImageCloudId"> {
    image?: Express.Multer.File,
}

export default async function addConnection(data: AddConnectionParameters) {
    return await Connection.create({
        user: data.user,
        birthday: data.birthday,
        description: data.description,
        displayName: data.displayName,
    });
}