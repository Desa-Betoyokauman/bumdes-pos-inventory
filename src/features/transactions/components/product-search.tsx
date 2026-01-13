"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useProducts } from "@/features/products/hooks/use-products";
import { Product } from "@/features/products/types";

interface ProductSearchProps {
  onSelectProduct: (product: Product) => void;
}

export function ProductSearch({ onSelectProduct }: ProductSearchProps) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { data: products = [] } = useProducts();

  const filteredProducts = products.filter(
    (product) =>
      product.stock > 0 &&
      (product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.code.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    setSearch("");
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari produk (nama atau kode)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(e.target.value.length > 0);
          }}
          onFocus={() => setShowResults(search.length > 0)}
          className="pl-10"
        />
      </div>

      {showResults && filteredProducts.length > 0 && (
        <Card className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto">
          <div className="divide-y">
            {filteredProducts.slice(0, 10).map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="flex w-full items-center justify-between p-3 text-left hover:bg-muted"
              >
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{product.code}</span>
                    <span>•</span>
                    <span>Stok: {product.stock}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(product.price)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}