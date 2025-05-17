import { AddProductDialog } from "@/components/AddProductDialog";
import { ProductTable } from "@/components/ProductTable";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Product from "@/lib/db/Product";
import { Menu, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ProductsHome() {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const products = Product.getAll();

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger className="md:hidden">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Products Overview</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="flex justify-between w-full mb-5">
          <div>
            <h2 className="text-xl font-semibold">All Products</h2>
            <p className="text-sm text-muted-foreground">
              Here is an overview of all products
            </p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <AddProductDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onSave={(data) => {
              const product = new Product(data);
              setAddDialogOpen(false);
              navigate(`/app/products/${product.id}`);
            }}
          />
        </div>
        <ProductTable
          products={products}
          isLoading={false}
          onUpdate={(id, data) => {
            Product.updateById(id, data);
          }}
        />
      </main>
    </SidebarInset>
  );
}
