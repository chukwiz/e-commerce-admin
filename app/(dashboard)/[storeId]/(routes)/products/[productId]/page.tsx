import { db } from "@/lib/prismadb";
import React from "react";
import ProductForm from "./components/productForm";

const ProductPage = async ({ params: {productId, storeId} }: { params: { productId: string, storeId: string } }) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },

    include: {
      images: true,
    },
  });

  const categories = await db.category.findMany({
    where: {
      storeId,
    }
  })

  const sizes = await db.size.findMany({
    where: {
      storeId,
    }
  })

  const colors = await db.size.findMany({
    where: {
      storeId,
    }
  })

  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} categories = {categories} sizes = {sizes} colors = {colors} />
      </div>
    </div>
  );
};

export default ProductPage;
