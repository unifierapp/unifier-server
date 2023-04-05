import Connection, {IConnection} from "@/models/Connection";

export default async function addConnection(data: Partial<IConnection>) {
    return await Connection.create({...data});
}