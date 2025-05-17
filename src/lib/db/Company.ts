import { saveObject, getObject } from "./utils";

type Currency =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "AUD"
  | "CAD"
  | "CHF"
  | "CNY"
  | "SEK"
  | "NZD"
  | "INR";

interface CompanyData {
  name: string;
  address: {
    building: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  taxId: string;
  taxIdentityType: string;
  phone: string;
  email: string;
  website: string;
  logoBase64: string;
  defaultCurrency: Currency;
}

class Company {
  name: string;
  address: {
    building: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  taxId: string;
  taxIdentityType: string;
  phone: string;
  email: string;
  website: string;
  logoBase64: string;
  defaultCurrency: Currency;

  constructor(data?: CompanyData) {
    if (getObject("Company", "default")) {
      const existingCompany = getObject("Company", "default");
      this.name = existingCompany.name;
      this.address = existingCompany.address;
      this.taxId = existingCompany.taxId;
      this.taxIdentityType = existingCompany.taxIdentityType;
      this.phone = existingCompany.phone;
      this.email = existingCompany.email;
      this.website = existingCompany.website;
      this.logoBase64 = existingCompany.logoBase64;
      this.defaultCurrency = existingCompany.defaultCurrency;
    } else {
      if (!data) {
        throw new Error("Company data is required");
      }
      const {
        name,
        address,
        taxId,
        taxIdentityType,
        phone,
        email,
        website,
        logoBase64,
        defaultCurrency,
      } = data;
      this.name = name;
      this.address = address;
      this.taxId = taxId;
      this.taxIdentityType = taxIdentityType;
      this.phone = phone;
      this.email = email;
      this.website = website;
      this.logoBase64 = logoBase64;
      this.defaultCurrency = defaultCurrency;

      saveObject("Company", this, "default");
    }
  }

  static isCompanySetup() {
    try {
      const company = getObject("Company", "default");
      if (company) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export default Company;
