import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  return (
    <section className="flex flex-col items-center justify-center h-screen mx-14 my-7">
      <h1 className="bg-gradient-to-r from-purple-500 via-purple-800 to-purple-500 bg-clip-text text-transparent text-[36px] text-center font-extrabold">
        Welcome,Share Posts And Chat With Your Friends{" "}
      </h1>
      <div className="">
        <Image
          src="/home-page.png"
          alt="home"
          width={340}
          height={340}
          className="object-contain"
        />
      </div>
      <div>
        <Link className="default_btn mt-2 w-full" href="/login">
          Start The Application
        </Link>
      </div>
    </section>
  );
}
