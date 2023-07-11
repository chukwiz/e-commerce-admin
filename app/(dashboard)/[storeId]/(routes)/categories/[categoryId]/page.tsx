import { db } from "@/lib/prismadb";
import React from "react";
import CategoryForm from "./components/CategoryForm";

const CategoryPage = async ({
  params: {categoryId, storeId},
}: {
  params: { categoryId: string, storeId: string };
}) => {

    const category = await db.category.findUnique({
        where: {
            id: categoryId
        }
    })

    const billboards = await db.billboard.findMany({
      where: {
        storeId
      }
    })
  return <div className=" flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
    </div>
  </div>;
};

export default CategoryPage;
