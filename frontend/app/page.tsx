import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-24 px-6 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Trisula Sport Club</h1>
        <LoginForm />
      </main>
    </div>
  );
}
