import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  MoreHorizontal,
  FileText,
  Download,
  ChevronUp,
  ChevronDown,
  Filter,
  X,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Invoice from "@/lib/db/Invoices";
import { Link, useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Client from "@/lib/db/Client";

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
}

type SortField =
  | "invoiceNumber"
  | "clientName"
  | "date"
  | "dueDate"
  | "total"
  | "status";
type SortDirection = "asc" | "desc";

export function InvoiceTable({ invoices, isLoading }: InvoiceTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(invoices);
  const [activeFilters, setActiveFilters] = useState<{
    status: string[];
    dateRange: { from?: Date; to?: Date };
    amountRange: { min?: number; max?: number };
    clients: string[];
  }>({
    status: [],
    dateRange: {},
    amountRange: {},
    clients: [],
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "date",
    direction: "desc",
  });
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "invoiceNumber",
    "client",
    "date",
    "dueDate",
    "amount",
    "status",
    "actions",
  ]);

  // Get unique clients for filter dropdown
  const uniqueClients = useMemo(() => {
    const clientIds = [...new Set(invoices.map((invoice) => invoice.clientId))];
    return clientIds.map((id) => ({
      id,
      name: Client.getById(id).name,
    }));
  }, [invoices]);

  // Apply filters and sorting
  const filteredAndSortedInvoices = useMemo(() => {
    // First apply search filter
    const filtered = localInvoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        Client.getById(invoice.clientId)
          .name.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Apply status filter
      const matchesStatus =
        activeFilters.status.length === 0 ||
        activeFilters.status.includes(invoice.status);

      // Apply client filter
      const matchesClient =
        activeFilters.clients.length === 0 ||
        activeFilters.clients.includes(invoice.clientId);

      // Apply date range filter
      const matchesDateRange =
        (!activeFilters.dateRange.from ||
          new Date(invoice.date) >= activeFilters.dateRange.from) &&
        (!activeFilters.dateRange.to ||
          new Date(invoice.date) <= activeFilters.dateRange.to);

      // Apply amount range filter
      const matchesAmountRange =
        (!activeFilters.amountRange.min ||
          invoice.total >= activeFilters.amountRange.min) &&
        (!activeFilters.amountRange.max ||
          invoice.total <= activeFilters.amountRange.max);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesClient &&
        matchesDateRange &&
        matchesAmountRange
      );
    });

    // Then apply sorting
    return filtered.sort((a, b) => {
      let aValue, bValue;

      // Determine values to compare based on sort field
      switch (sortConfig.field) {
        case "invoiceNumber":
          aValue = a.invoiceNumber;
          bValue = b.invoiceNumber;
          break;
        case "clientName":
          aValue = Client.getById(a.clientId).name;
          bValue = Client.getById(b.clientId).name;
          break;
        case "date":
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case "dueDate":
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case "total":
          aValue = a.total;
          bValue = b.total;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.date;
          bValue = b.date;
      }

      // Compare values based on sort direction
      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [localInvoices, searchTerm, activeFilters, sortConfig]);

  const handleStatusChange = (
    invoiceId: string,
    newStatus: "draft" | "sent" | "paid" | "overdue"
  ) => {
    // Update the invoice status
    const newInvoice = Invoice.updateStatusById(invoiceId, newStatus);
    setLocalInvoices((prevInvoices) =>
      prevInvoices
        .filter((invoice) => invoice.id !== invoiceId)
        .concat(newInvoice)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "sent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleSort = (field: SortField) => {
    setSortConfig({
      field,
      direction:
        sortConfig.field === field && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return null;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const toggleColumnVisibility = (column: string) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== column));
    } else {
      setVisibleColumns([...visibleColumns, column]);
    }
  };

  const clearFilters = () => {
    setActiveFilters({
      status: [],
      dateRange: {},
      amountRange: {},
      clients: [],
    });
    setSearchTerm("");
  };

  const addStatusFilter = (status: string) => {
    if (activeFilters.status.includes(status)) {
      setActiveFilters({
        ...activeFilters,
        status: activeFilters.status.filter((s) => s !== status),
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        status: [...activeFilters.status, status],
      });
    }
  };

  const addClientFilter = (clientId: string) => {
    if (activeFilters.clients.includes(clientId)) {
      setActiveFilters({
        ...activeFilters,
        clients: activeFilters.clients.filter((id) => id !== clientId),
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        clients: [...activeFilters.clients, clientId],
      });
    }
  };

  const setDateRangeFilter = (from?: Date, to?: Date) => {
    setActiveFilters({
      ...activeFilters,
      dateRange: { from, to },
    });
  };

  const setAmountRangeFilter = (min?: number, max?: number) => {
    setActiveFilters({
      ...activeFilters,
      amountRange: { min, max },
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.status.length > 0) count++;
    if (activeFilters.clients.length > 0) count++;
    if (activeFilters.dateRange.from || activeFilters.dateRange.to) count++;
    if (activeFilters.amountRange.min || activeFilters.amountRange.max) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices or clients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="neutral" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge className="ml-1 bg-primary text-primary-foreground">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter Invoices</h4>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="neutral"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="space-y-2 border-2 p-3 rounded-md">
                    <h5 className="text-sm font-medium flex items-center">
                      <Badge className="mr-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        <span className="sr-only">Status icon</span>
                        <div className="h-2 w-2 rounded-full bg-current"></div>
                      </Badge>
                      Status
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {["draft", "sent", "paid", "overdue"].map((status) => (
                        <div
                          key={status}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`status-${status}`}
                            checked={activeFilters.status.includes(status)}
                            onCheckedChange={() => addStatusFilter(status)}
                          />
                          <Label
                            htmlFor={`status-${status}`}
                            className="capitalize"
                          >
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-2 p-3 rounded-md">
                  <h5 className="text-sm font-medium flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Clients
                  </h5>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {uniqueClients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`client-${client.id}`}
                          checked={activeFilters.clients.includes(client.id)}
                          onCheckedChange={() => addClientFilter(client.id)}
                          className="m-2"
                        />
                        <Label htmlFor={`client-${client.id}`}>
                          {client.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-2 p-3 rounded-md">
                  <h5 className="text-sm font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Range
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="date-from" className="text-xs">
                        From
                      </Label>
                      <Input
                        id="date-from"
                        type="date"
                        className="h-8"
                        value={
                          activeFilters.dateRange.from
                            ?.toISOString()
                            .split("T")[0] || ""
                        }
                        onChange={(e) => {
                          const from = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          setDateRangeFilter(from, activeFilters.dateRange.to);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="date-to" className="text-xs">
                        To
                      </Label>
                      <Input
                        id="date-to"
                        type="date"
                        className="h-8"
                        value={
                          activeFilters.dateRange.to
                            ?.toISOString()
                            .split("T")[0] || ""
                        }
                        onChange={(e) => {
                          const to = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          setDateRangeFilter(activeFilters.dateRange.from, to);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-2 p-3 rounded-md">
                  <h5 className="text-sm font-medium flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Amount Range
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="amount-min" className="text-xs">
                        Min ($)
                      </Label>
                      <Input
                        id="amount-min"
                        type="number"
                        className="h-8"
                        placeholder="0"
                        value={activeFilters.amountRange.min || ""}
                        onChange={(e) => {
                          const min = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          setAmountRangeFilter(
                            min,
                            activeFilters.amountRange.max
                          );
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="amount-max" className="text-xs">
                        Max ($)
                      </Label>
                      <Input
                        id="amount-max"
                        type="number"
                        className="h-8"
                        placeholder="9999"
                        value={activeFilters.amountRange.max || ""}
                        onChange={(e) => {
                          const max = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          setAmountRangeFilter(
                            activeFilters.amountRange.min,
                            max
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="neutral">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("invoiceNumber")}
                onCheckedChange={() => toggleColumnVisibility("invoiceNumber")}
              >
                Invoice #
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("client")}
                onCheckedChange={() => toggleColumnVisibility("client")}
              >
                Client
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("date")}
                onCheckedChange={() => toggleColumnVisibility("date")}
              >
                Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("dueDate")}
                onCheckedChange={() => toggleColumnVisibility("dueDate")}
              >
                Due Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("amount")}
                onCheckedChange={() => toggleColumnVisibility("amount")}
              >
                Amount
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("status")}
                onCheckedChange={() => toggleColumnVisibility("status")}
              >
                Status
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            defaultValue="newest"
            onValueChange={(value) => {
              if (value === "newest") {
                setSortConfig({ field: "date", direction: "desc" });
              } else if (value === "oldest") {
                setSortConfig({ field: "date", direction: "asc" });
              } else if (value === "highest") {
                setSortConfig({ field: "total", direction: "desc" });
              } else if (value === "lowest") {
                setSortConfig({ field: "total", direction: "asc" });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="highest">Highest amount</SelectItem>
              <SelectItem value="lowest">Lowest amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.status.map((status) => (
            <Badge
              key={`filter-${status}`}
              // variant="reverse"
              className="flex items-center gap-1"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => addStatusFilter(status)}
              />
            </Badge>
          ))}
          {activeFilters.clients.map((clientId) => (
            <Badge
              key={`filter-client-${clientId}`}
              className="flex items-center gap-1"
            >
              {Client.getById(clientId).name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => addClientFilter(clientId)}
              />
            </Badge>
          ))}
          {(activeFilters.dateRange.from || activeFilters.dateRange.to) && (
            <Badge className="flex items-center gap-1">
              Date:{" "}
              {activeFilters.dateRange.from?.toLocaleDateString() || "Any"} -{" "}
              {activeFilters.dateRange.to?.toLocaleDateString() || "Any"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setDateRangeFilter(undefined, undefined)}
              />
            </Badge>
          )}
          {(activeFilters.amountRange.min || activeFilters.amountRange.max) && (
            <Badge className="flex items-center gap-1">
              Amount: ${activeFilters.amountRange.min || "0"} - $
              {activeFilters.amountRange.max || "∞"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setAmountRangeFilter(undefined, undefined)}
              />
            </Badge>
          )}
          <Button
            variant="neutral"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.includes("invoiceNumber") && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("invoiceNumber")}
                >
                  <div className="flex items-center">
                    Invoice #{getSortIcon("invoiceNumber")}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("client") && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("clientName")}
                >
                  <div className="flex items-center">
                    Client
                    {getSortIcon("clientName")}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("date") && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {getSortIcon("date")}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("dueDate") && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("dueDate")}
                >
                  <div className="flex items-center">
                    Due Date
                    {getSortIcon("dueDate")}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("amount") && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center">
                    Amount
                    {getSortIcon("total")}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("status") && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("actions") && (
                <TableHead className="w-[80px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: visibleColumns.length }).map(
                    (_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))
            ) : filteredAndSortedInvoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="h-24 text-center"
                >
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {visibleColumns.includes("invoiceNumber") && (
                    <TableCell className="font-medium">
                      <Link
                        to={`/app/invoices/${invoice.id}`}
                        className="hover:underline text-primary"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </TableCell>
                  )}
                  {visibleColumns.includes("client") && (
                    <TableCell>
                      <Link
                        to={`/app/clients/${invoice.clientId}`}
                        className="hover:underline text-primary"
                      >
                        {Client.getById(invoice.clientId).name}
                      </Link>
                    </TableCell>
                  )}
                  {visibleColumns.includes("date") && (
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                  )}
                  {visibleColumns.includes("dueDate") && (
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  )}
                  {visibleColumns.includes("amount") && (
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("status") && (
                    <TableCell>
                      <Badge className={getStatusBadgeClass(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("actions") && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="neutral" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              navigate(`/app/invoices/${invoice.id}`);
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              window.open(
                                `/app/invoices/${invoice.id}/print`,
                                "_blank"
                              );
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(invoice.id, "draft")
                            }
                            disabled={invoice.status === "draft"}
                          >
                            Mark as Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(invoice.id, "sent")
                            }
                            disabled={invoice.status === "sent"}
                          >
                            Mark as Sent
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(invoice.id, "paid")
                            }
                            disabled={invoice.status === "paid"}
                          >
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(invoice.id, "overdue")
                            }
                            disabled={invoice.status === "overdue"}
                          >
                            Mark as Overdue
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          Showing {filteredAndSortedInvoices.length} of {localInvoices.length}{" "}
          invoices
        </div>
        <div>
          {getActiveFilterCount() > 0 && (
            <Button
              variant="noShadow"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-xs"
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
