import { AddProductDialog } from "@/components/AddProductDialog";
import { ProductTable } from "@/components/ProductTable";
import { Button } from "@/components/ui/button";
import Product from "@/lib/db/Product";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ProductsHome() {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const products = Product.getAll();

  return (
    <>
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
    </>
  );
}
