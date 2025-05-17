import { saveObject, getObject, getAllObjects, deleteObject } from "./utils";

class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  taxPercent: number;

  constructor(data: {
    name: string;
    description: string;
    price: number;
    taxPercent?: number;
  }) {
    this.id = window.crypto.randomUUID();
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.taxPercent = data.taxPercent ?? 0;

    saveObject("Product", this, this.id);
  }

  static getById(id: string) {
    return getObject("Product", id);
  }

  static getAll() {
    const allProducts = getAllObjects("Product");
    if (!allProducts) {
      return [];
    }
    return allProducts;
  }

  static getCount() {
    return this.getAll().length;
  }

  static deleteById(id: string) {
    deleteObject("Product", id);
  }

  static updateById(id: string, data: Partial<Product>) {
    const product = this.getById(id);
    if (product) {
      const updatedProduct = { ...product, ...data };
      saveObject("Product", updatedProduct, id);
      return updatedProduct;
    }
    return null;
  }
}

export default Product;
