"use client";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart | null; item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }

      // Handle success add to cart
      toast({
        description: res.message,
        action: (
          <ToastAction
            className="bg-primary text-white hover:bg-gray-800"
            altText="Go To Cart"
            onClick={() => {
              router.push("/cart");
            }}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
    });

    return;
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((i) => i.productId === item.productId);

  return existItem ? (
    <div>
      <Button variant="outline" type="button" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <Minus className="size-4"></Minus>
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button variant="outline" type="button" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4"></Plus>
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="size-4 animate-spin" />
      ) : (
        <Plus className="size-4"></Plus>
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
