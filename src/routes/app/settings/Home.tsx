"use client";

import type React from "react";

import { useTheme } from "@/components/ThemeProvider";
import Company from "@/lib/db/Company";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  Upload,
  Palette,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Settings() {
  const { themes, setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const companyInstance = new Company();
  const [company, setCompany] = useState({ ...companyInstance });
  const [selectedTheme, setSelectedTheme] = useState(theme);

  // Update theme immediately when selected
  useEffect(() => {
    setTheme(selectedTheme);
  }, [navigate, selectedTheme, setTheme]);

  const handleInputChange = (field: string, value: string) => {
    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setCompany((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCompany((prev) => ({
        ...prev,
        logoBase64: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      Company.updateCompany(company);
      toast.success("Settings saved successfully!");
      navigate(`/app/settings`);
    } catch {
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSave} size="lg" className="gap-2">
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Manage your company details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company Name
                    </Label>
                    <Input
                      id="name"
                      value={company.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="taxId"
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Tax ID
                      </Label>
                      <Input
                        id="taxId"
                        value={company.taxId}
                        onChange={(e) =>
                          handleInputChange("taxId", e.target.value)
                        }
                        placeholder="Enter tax ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxIdentityType">Tax Identity Type</Label>
                      <Input
                        id="taxIdentityType"
                        value={company.taxIdentityType}
                        onChange={(e) =>
                          handleInputChange("taxIdentityType", e.target.value)
                        }
                        placeholder="Enter tax identity type"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={company.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={company.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={company.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        placeholder="Enter website URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Default Currency</Label>
                      <Select
                        value={company.defaultCurrency}
                        onValueChange={(value) =>
                          handleInputChange("defaultCurrency", value)
                        }
                      >
                        <SelectTrigger id="defaultCurrency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">
                            GBP - British Pound
                          </SelectItem>
                          <SelectItem value="JPY">
                            JPY - Japanese Yen
                          </SelectItem>
                          <SelectItem value="AUD">
                            AUD - Australian Dollar
                          </SelectItem>
                          <SelectItem value="CAD">
                            CAD - Canadian Dollar
                          </SelectItem>
                          <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                          <SelectItem value="CNY">
                            CNY - Chinese Yuan
                          </SelectItem>
                          <SelectItem value="SEK">
                            SEK - Swedish Krona
                          </SelectItem>
                          <SelectItem value="NZD">
                            NZD - New Zealand Dollar
                          </SelectItem>
                          <SelectItem value="INR">
                            INR - Indian Rupee
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/3 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Company Logo</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 h-40">
                      {company.logoBase64 ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={company.logoBase64 || "/placeholder.svg"}
                            alt="Company Logo"
                            className="max-h-full max-w-full object-contain"
                          />
                          <Button
                            variant="neutral"
                            size="sm"
                            className="absolute bottom-0 right-0"
                            onClick={() => handleInputChange("logoBase64", "")}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop or click to upload
                          </p>
                          <Input
                            id="logo"
                            type="file"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                          <Button
                            variant="neutral"
                            size="sm"
                            onClick={() =>
                              document.getElementById("logo")?.click()
                            }
                          >
                            Select File
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 512x512px PNG or JPG
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle>Company Address</CardTitle>
              <CardDescription>
                Update your company's physical location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="building">Building/Suite</Label>
                    <Input
                      id="building"
                      value={company.address.building}
                      onChange={(e) =>
                        handleAddressChange("building", e.target.value)
                      }
                      placeholder="Building or suite number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={company.address.street}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={company.address.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      placeholder="City"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={company.address.state}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                      placeholder="State or province"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal/Zip Code</Label>
                    <Input
                      id="zip"
                      value={company.address.zip}
                      onChange={(e) =>
                        handleAddressChange("zip", e.target.value)
                      }
                      placeholder="Postal or zip code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={company.address.country}
                      onChange={(e) =>
                        handleAddressChange("country", e.target.value)
                      }
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted rounded-lg flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address Preview</p>
                  <p className="text-sm text-muted-foreground">
                    {company.address.building &&
                      `${company.address.building}, `}
                    {company.address.street && `${company.address.street}, `}
                    {company.address.city && `${company.address.city}, `}
                    {company.address.state && `${company.address.state} `}
                    {company.address.zip && `${company.address.zip}, `}
                    {company.address.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Theme
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(themes).map(([key, color]) => (
                      <div
                        key={key}
                        className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                          selectedTheme === key
                            ? "border-primary ring-2 ring-primary ring-opacity-50"
                            : "border-border"
                        }`}
                        onClick={() => {
                          setSelectedTheme(key as typeof theme);
                          navigate(`/app/settings`);
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="h-5 w-5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium capitalize">{key}</span>
                        </div>
                        <div
                          className="h-12 w-full rounded-md"
                          style={{ backgroundColor: color, opacity: 0.2 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
