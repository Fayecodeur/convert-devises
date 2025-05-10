import CurrencyConverter from "./components/CurrencyConverter";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff9db] via-[#fce38a] to-[#f9d976]">
      <CurrencyConverter />
    </main>
  );
}
