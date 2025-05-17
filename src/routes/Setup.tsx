"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import Company from "@/lib/db/Company";

// Mock Company class for the example
const CompanyService = {
  isCompanySetup: () => false,
  saveCompanyInfo: (info: Company) => {
    new Company(info);
    return true;
  },
};

// Setup process for setting up the company information for the 1st time.
export default function Setup() {
  const navigate = useNavigate();

  // Step 1: Company Name, Address and Logo
  // Step 2: Tax ID and Tax Identity Type
  // Step 3: Phone Number, Email and Website
  // Step 4: Default Currency
  const [step, setStep] = useState(0);
  const [companyInfo, setCompanyInfo] = useState<Company>({
    name: "",
    address: {
      building: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    taxId: "",
    taxIdentityType: "",
    phone: "",
    email: "",
    website: "",
    logoBase64: "",
    defaultCurrency: "USD",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (CompanyService.isCompanySetup()) {
    navigate("/app");
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!companyInfo.name.trim()) {
          newErrors.name = "Company name is required";
        }
        if (!companyInfo.address.city.trim()) {
          newErrors.city = "City is required";
        }
        if (!companyInfo.address.country.trim()) {
          newErrors.country = "Country is required";
        }
        break;
      case 1:
        if (!companyInfo.taxId.trim()) {
          newErrors.taxId = "Tax ID is required";
        }
        if (!companyInfo.taxIdentityType.trim()) {
          newErrors.taxIdentityType = "Tax identity type is required";
        }
        break;
      case 2:
        if (!companyInfo.phone.trim()) {
          newErrors.phone = "Phone number is required";
        }
        if (!companyInfo.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(companyInfo.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        break;
      case 3:
        if (!companyInfo.defaultCurrency.trim()) {
          newErrors.defaultCurrency = "Default currency is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        // Save the company info and navigate to the app
        const success = CompanyService.saveCompanyInfo(companyInfo);
        if (success) {
          toast.success("Your company has been successfully set up!");
          navigate("/app");
        } else {
          toast.error(
            "There was an error saving your company information. Please try again."
          );
        }
      }
    }
  };

  // Render the steps
  function renderStep(step: number) {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Genvoice</CardTitle>
              <CardDescription>Let's get your company setup!</CardDescription>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                Step 1: General Company Information
              </h2>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    type="text"
                    id="company-name"
                    name="company-name"
                    placeholder="Company Name"
                    value={companyInfo.name}
                    onChange={(e) =>
                      setCompanyInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-logo">Company Logo</Label>
                  <Input
                    type="file"
                    id="company-logo"
                    name="company-logo"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCompanyInfo((prev) => ({
                            ...prev,
                            logoBase64: reader.result as string,
                          }));
                        };
                        reader.onerror = (error) => {
                          console.error(
                            "Error converting file to base64",
                            error
                          );
                        };
                        reader.readAsDataURL(file);
                      } catch (error) {
                        console.error("Error handling file upload", error);
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Input
                      type="text"
                      id="building"
                      name="building"
                      placeholder="Building"
                      value={companyInfo.address.building}
                      onChange={(e) =>
                        setCompanyInfo((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            building: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      type="text"
                      id="street"
                      name="street"
                      placeholder="Street"
                      value={companyInfo.address.street}
                      onChange={(e) =>
                        setCompanyInfo((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            street: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="City"
                      value={companyInfo.address.city}
                      onChange={(e) =>
                        setCompanyInfo((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            city: e.target.value,
                          },
                        }))
                      }
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="State"
                      value={companyInfo.address.state}
                      onChange={(e) =>
                        setCompanyInfo((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            state: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      type="text"
                      id="country"
                      name="country"
                      placeholder="Country"
                      value={companyInfo.address.country}
                      onChange={(e) =>
                        setCompanyInfo((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            country: e.target.value,
                          },
                        }))
                      }
                      className={errors.country ? "border-red-500" : ""}
                    />
                    {errors.country && (
                      <p className="text-sm text-red-500">{errors.country}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input
                      type="text"
                      id="zip"
                      name="zip"
                      placeholder="Zip Code"
                      value={companyInfo.address.zip}
                      onChange={(e) =>
                        setCompanyInfo((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            zip: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
              <CardDescription>
                Enter your company's tax details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                Step 2: Tax Information
              </h2>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID</Label>
                  <Input
                    type="text"
                    id="tax-id"
                    name="tax-id"
                    placeholder="Tax ID Number"
                    value={companyInfo.taxId}
                    onChange={(e) =>
                      setCompanyInfo((prev) => ({
                        ...prev,
                        taxId: e.target.value,
                      }))
                    }
                    className={errors.taxId ? "border-red-500" : ""}
                  />
                  {errors.taxId && (
                    <p className="text-sm text-red-500">{errors.taxId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-identity-type">Tax Identity Type</Label>
                  {!["EIN", "SSN", "VAT", "GST", "TIN"].includes(
                    companyInfo.taxIdentityType
                  ) || companyInfo.taxIdentityType === "OTHER" ? (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        id="custom-tax-identity"
                        name="custom-tax-identity"
                        placeholder="Enter custom tax identity type"
                        value={
                          companyInfo.taxIdentityType === "OTHER"
                            ? ""
                            : companyInfo.taxIdentityType
                        }
                        onChange={(e) =>
                          setCompanyInfo((prev) => ({
                            ...prev,
                            taxIdentityType: e.target.value,
                          }))
                        }
                        className={
                          errors.taxIdentityType ? "border-red-500" : ""
                        }
                      />
                      <Button
                        variant="reverse"
                        size="sm"
                        onClick={() =>
                          setCompanyInfo((prev) => ({
                            ...prev,
                            taxIdentityType: "EIN",
                          }))
                        }
                      >
                        Back to selection
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value={companyInfo.taxIdentityType}
                      onValueChange={(value) =>
                        setCompanyInfo((prev) => ({
                          ...prev,
                          taxIdentityType: value,
                        }))
                      }
                    >
                      <SelectTrigger
                        id="tax-identity-type"
                        className={
                          errors.taxIdentityType ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder="Select tax identity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EIN">
                          EIN (Employer Identification Number)
                        </SelectItem>
                        <SelectItem value="SSN">
                          SSN (Social Security Number)
                        </SelectItem>
                        <SelectItem value="VAT">
                          VAT (Value Added Tax)
                        </SelectItem>
                        <SelectItem value="GST">
                          GST (Goods and Services Tax)
                        </SelectItem>
                        <SelectItem value="TIN">
                          TIN (Taxpayer Identification Number)
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {errors.taxIdentityType && (
                    <p className="text-sm text-red-500">
                      {errors.taxIdentityType}
                    </p>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Your tax information is used for legal compliance and will
                    appear on invoices. Make sure this information is accurate.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How can your clients reach you?</CardDescription>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                Step 3: Contact Details
              </h2>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={companyInfo.phone}
                    onChange={(e) =>
                      setCompanyInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    value={companyInfo.email}
                    onChange={(e) =>
                      setCompanyInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    type="url"
                    id="website"
                    name="website"
                    placeholder="https://yourcompany.com"
                    value={companyInfo.website}
                    onChange={(e) =>
                      setCompanyInfo((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                  />
                </div>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Contact Information</AlertTitle>
                  <AlertDescription>
                    This information will appear on your invoices and be used
                    for client communications.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
              <CardDescription>Set your default currency</CardDescription>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                Step 4: Default Currency
              </h2>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select
                    value={companyInfo.defaultCurrency}
                    onValueChange={(value) =>
                      // @ts-expect-error - Will work.
                      setCompanyInfo((prev) => ({
                        ...prev,
                        defaultCurrency: value,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="default-currency"
                      className={errors.defaultCurrency ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select default currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">
                        AUD - Australian Dollar
                      </SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.defaultCurrency && (
                    <p className="text-sm text-red-500">
                      {errors.defaultCurrency}
                    </p>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Currency Setting</AlertTitle>
                  <AlertDescription>
                    This will be the default currency for all your invoices. You
                    can change the currency for individual invoices later.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  }

  // Progress indicator
  const renderProgress = () => {
    return (
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between mb-2">
          {["Company Info", "Tax Details", "Contact", "Currency"].map(
            (label, index) => (
              <div
                key={index}
                className={`text-xs font-medium ${
                  step >= index ? "text-primary" : "text-gray-400"
                }`}
              >
                {label}
              </div>
            )
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <Progress value={((step + 1) / 4) * 100} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-2">Company Setup</h1>
      <p className="text-gray-500 mb-6">
        Complete the following steps to set up your company
      </p>

      {renderProgress()}

      <div className="w-full max-w-md">{renderStep(step)}</div>

      <div className="flex justify-between w-full max-w-md mt-6">
        <Button
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={step === 0}
          variant="reverse"
        >
          Back
        </Button>
        <Button onClick={handleNext}>{step === 3 ? "Finish" : "Next"}</Button>
      </div>
    </div>
  );
}
