import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header></Header>
      <main className="flex-1 wrapper">
        <Suspense>{children}</Suspense>
        {/* {children} */}
      </main>
      <Footer></Footer>
    </div>
  );
}
