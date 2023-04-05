import mongoose from "mongoose";

export interface IFederatedClient {
    provider: string;
    domain: string;
    client_id: string;
    client_secret: string;
    redirect_url: string;
}

const FederatedClientSchema = new mongoose.Schema<IFederatedClient>({
    provider: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true,
    },
    client_id: {
        type: String,
        required: true,
    },
    client_secret: {
        type: String,
        required: true
    },
    redirect_url: {
        type: String,
        required: true,
    }
})

const FederatedClient = mongoose.model<IFederatedClient>("FederatedClient", FederatedClientSchema);

export default FederatedClient