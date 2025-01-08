import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle></ModeToggle>
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart></ShoppingCart> Cart
          </Link>
        </Button>
        <UserButton></UserButton>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical></EllipsisVertical>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle></ModeToggle>
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart></ShoppingCart> Cart
              </Link>
            </Button>
            <UserButton></UserButton>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
