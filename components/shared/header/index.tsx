import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { ShoppingCart, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ModeToggle from "./mode-toggle";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper justify-between">
        <div>
          <Link href="/" className="flex items-center">
            <Image
              src="/globe.svg"
              alt={APP_NAME}
              height={48}
              width={48}
              priority={true}
            ></Image>
            <span className="hidden lg:inline font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="space-x-2">
          <ModeToggle></ModeToggle>
          <Button asChild variant="ghost">
            <Link href="/cart">
              <ShoppingCart></ShoppingCart> Cart
            </Link>
          </Button>
          <Button asChild>
            <Link href="/sign-in">
              <UserIcon></UserIcon> Sign In
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
