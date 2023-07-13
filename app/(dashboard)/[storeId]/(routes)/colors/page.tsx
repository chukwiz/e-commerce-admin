import {format} from "date-fns";

import React from "react";
import { ColorsClient } from "./components/client";
import { db } from "@/lib/prismadb";
import { ColorsColumn } from "./components/columns";

const ColorsPage = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const colors = await db.color.findMany({
    where: {
      storeId,
    },

    orderBy: { createdAt: "desc" },
  });

  const formattedColors:ColorsColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;