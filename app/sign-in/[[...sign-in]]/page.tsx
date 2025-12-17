import { SignIn } from "@clerk/nextjs";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center py-35">
        <SignIn />
      </div>
      <Footer />
    </>
  );
}
