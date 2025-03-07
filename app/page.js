import { Button } from "../components/ui/button";
import { UserButton } from "@clerk/nextjs"
import Link from "next/link";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>hello world</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <Button>Click me</Button>
        <UserButton />
        <Link href={'/dashboard'}>
          <Button>Dashbaord</Button>
        </Link>
      </div>
    </div>
  );
}
