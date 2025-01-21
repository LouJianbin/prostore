import { approveAlipayOrder, getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  if (order.paymentMethod === "Alipay") {
    await approveAlipayOrder(order.id);
  }

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user.role === Role.admin || false}
      ></OrderDetailsTable>
    </>
  );
};

export default OrderDetailPage;
