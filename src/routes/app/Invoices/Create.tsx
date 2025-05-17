"use client";

import { CardFooter } from "@/components/ui/card";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Plus,
  Trash2,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Client from "@/lib/db/Client";
import Product from "@/lib/db/Product";
import Invoice from "@/lib/db/Invoices";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormalInvoice from "@/components/FormalInvoice";
import { Textarea } from "@/components/ui/textarea";

type LineItem = {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type FormValues = {
  clientId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid" | "overdue";
  terms?: string;
};

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientOpen, setClientOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    defaultValues: {
      clientId: "",
      invoiceNumber: "",
      invoiceDate: new Date(),
      dueDate: addDays(new Date(), 30),
      status: "draft",
      terms: "", // <-- Added default value for terms
    },
  });

  // Load clients and products on component mount
  useEffect(() => {
    try {
      const allClients = Client.getAll();
      const allProducts = Product.getAll();
      setClients(allClients);
      setProducts(allProducts);

      // Generate invoice number (current date + random number)
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(
        date.getMonth() + 1
      ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
      // const randomNum = Math.floor(Math.random() * 1000)
      //   .toString()
      //   .padStart(3, "0");
      const invoicesToday = Invoice.getAll().filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        return (
          invoiceDate.getFullYear() === date.getFullYear() &&
          invoiceDate.getMonth() === date.getMonth() &&
          invoiceDate.getDate() === date.getDate()
        );
      });

      form.setValue(
        "invoiceNumber",
        `INV-${dateStr}-${(invoicesToday.length + 1)
          .toString()
          .padStart(3, "0")}`
      );
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    }
  }, [form]);

  // Calculate totals whenever line items change
  useEffect(() => {
    const newSubtotal = lineItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    setSubtotal(newSubtotal);

    // Calculate tax based on the products' tax percentages
    const newTax = lineItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (item.totalPrice * (product?.taxPercent || 0)) / 100;
    }, 0);

    setTax(newTax);
    setTotal(newSubtotal + newTax);
  }, [lineItems, products]);

  const handleAddLineItem = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newItem = {
      id: window.crypto.randomUUID(),
      productId: product.id,
      description: product.description,
      quantity: 1,
      unitPrice: product.price,
      totalPrice: product.price,
    };

    setLineItems([...lineItems, newItem]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, quantity); // Ensure quantity is at least 1
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const onSubmit = (data: FormValues) => {
    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }

    if (lineItems.length === 0) {
      toast.error("Please add at least one item to the invoice");
      return;
    }

    try {
      // Create invoice items in the format expected by the Invoice class
      const invoiceItems = lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));

      // Create new invoice
      new Invoice({
        clientId: selectedClient.id,
        invoiceNumber: data.invoiceNumber,
        status: data.status,
        date: data.invoiceDate.toISOString(),
        dueDate: data.dueDate.toISOString(),
        items: invoiceItems,
        subtotal,
        tax,
        total,
        terms: data.terms, // <-- Pass terms to Invoice
      });

      toast.success("Invoice created successfully!");
      navigate("/app/invoices"); // Redirect to invoices list page
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Error creating invoice. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Invoice Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create New Invoice</CardTitle>
            <CardDescription>
              Fill in the details to create a new invoice
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {/* Client Selection */}
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Popover open={clientOpen} onOpenChange={setClientOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="neutral"
                        role="combobox"
                        aria-expanded={clientOpen}
                        className={cn(
                          "w-full justify-between",
                          !selectedClient && "text-muted-foreground"
                        )}
                      >
                        {selectedClient
                          ? selectedClient.name
                          : "Select client..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search clients..." />
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {clients.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={client.name}
                                onSelect={() => {
                                  setSelectedClient(client);
                                  form.setValue("clientId", client.id);
                                  setClientOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedClient?.id === client.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{client.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {client.email}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.clientId && (
                    <p className="text-sm text-red-500 mt-1">
                      Please select a client
                    </p>
                  )}
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Invoice Date</FormLabel>
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="neutral"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Select date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date: unknown) => {
                                field.onChange(date);
                                setDateOpen(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover
                          open={dueDateOpen}
                          onOpenChange={setDueDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="neutral"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Select date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date: unknown) => {
                                field.onChange(date);
                                setDueDateOpen(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex items-center">
                              <Badge variant="neutral" className="mr-2">
                                Draft
                              </Badge>
                              <span>Draft</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="sent">
                            <div className="flex items-center">
                              <Badge className="mr-2 bg-blue-500">Sent</Badge>
                              <span>Sent</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="paid">
                            <div className="flex items-center">
                              <Badge className="mr-2 bg-green-500">Paid</Badge>
                              <span>Paid</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="overdue">
                            <div className="flex items-center">
                              <Badge className="mr-2 bg-red-500">Overdue</Badge>
                              <span>Overdue</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Line Items */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Line Items</h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="neutral">
                          <Plus className="h-4 w-4 mr-2" /> Add Item
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search products..." />
                          <CommandEmpty>No products found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {products.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={product.name}
                                  onSelect={() => handleAddLineItem(product.id)}
                                >
                                  <div className="flex flex-col">
                                    <span>{product.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {lineItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lineItems.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.productId
                          );
                          return (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="font-medium">
                                  {product?.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {item.description}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                ${item.unitPrice.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                ${item.totalPrice.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="reverse"
                                  size="icon"
                                  onClick={() => handleRemoveLineItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground border rounded-md">
                      No items added yet. Click "Add Item" to add products to
                      this invoice.
                    </div>
                  )}
                </div>

                {/* Terms Field */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Payment due in 30 days"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Totals */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="neutral"
                  type="button"
                  onClick={() => navigate("/app/invoices")}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Invoice</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Right Column - Invoice Preview */}
        <div className="w-full sticky top-6 self-start">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
              <CardDescription>
                Live preview of how your invoice will look
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-scroll max-h-[80vh]">
              <div className="border rounded-md">
                <FormalInvoice
                  previewData={{
                    invoiceNumber: form.watch("invoiceNumber") || "INV-0000",
                    date:
                      form.watch("invoiceDate")?.toISOString() ||
                      new Date().toISOString(),
                    dueDate:
                      form.watch("dueDate")?.toISOString() ||
                      new Date().toISOString(),
                    status: form.watch("status") || "draft",
                    items: lineItems,
                    subtotal,
                    tax,
                    total,
                    terms: form.watch("terms") || "", // <-- Pass terms to preview
                  }}
                  clientName={selectedClient?.name}
                  clientAddress={
                    selectedClient
                      ? `${selectedClient.address?.building ?? ""} ${
                          selectedClient.address?.street ?? ""
                        }, ${selectedClient.address?.city ?? ""}, ${
                          selectedClient.address?.state ?? ""
                        }, ${selectedClient.address?.country || ""} - ${
                          selectedClient.address?.zipCode ?? ""
                        }`
                      : undefined
                  }
                  clientEmail={selectedClient?.email}
                  clientPhone={selectedClient?.phone}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
