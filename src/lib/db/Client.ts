import { saveObject, getObject, getAllObjects, deleteObject } from "./utils";

interface ClientCreateArgs {
  name: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  address: {
    building?: string;
    street?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  taxID?: string;
  notes: string;
}

class Client {
  id: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  address: {
    building?: string;
    street?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  taxID?: string;
  notes: string;

  constructor(data: ClientCreateArgs) {
    this.id = window.crypto.randomUUID();
    this.name = data.name;
    this.contactPerson = data.contactPerson;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.taxID = data.taxID;
    this.notes = data.notes;

    saveObject("Client", this, this.id);
  }

  static getCount() {
    return this.getAll().length;
  }

  static getById(id: string) {
    return getObject("Client", id);
  }

  static getAll() {
    const allClients = getAllObjects("Client");
    if (!allClients) {
      return [];
    }
    return allClients;
  }

  static deleteById(id: string) {
    deleteObject("Client", id);
  }

  static updateById(id: string, data: Partial<ClientCreateArgs>) {
    const client = this.getById(id);
    if (!client) {
      throw new Error("Client not found");
    }
    const updatedClient = { ...client, ...data };
    saveObject("Client", updatedClient, id);
  }
}

export default Client;
