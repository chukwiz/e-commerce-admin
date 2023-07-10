import { db } from "@/lib/prismadb";
import { FC } from "react";

interface DashboardProps {
  params: { storeId: string };
}

const Dashboard: FC<DashboardProps> = async ({ params }) => {
    const store = await db.store.findFirst({
        where: {
            id: params.storeId
        }
    })
  return (
        <div>
            Active Store: {store?.name}
        </div>
    )
};

export default Dashboard;
