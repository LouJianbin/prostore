import { approveAlipayOrder, getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";

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
      ></OrderDetailsTable>
    </>
  );
};

export default OrderDetailPage;
