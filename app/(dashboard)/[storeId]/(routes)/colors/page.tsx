import {format} from "date-fns";

import React from "react";
import { SizesClient } from "./components/client";
import { db } from "@/lib/prismadb";
import { SizesColumn } from "./components/columns";

const SizesPage = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const sizes = await db.size.findMany({
    where: {
      storeId,
    },

    orderBy: { createdAt: "desc" },
  });

  const formattedSizes:SizesColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;