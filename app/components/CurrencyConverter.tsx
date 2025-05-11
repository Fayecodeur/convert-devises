"use client";

import { useState, useEffect } from "react";

const currencies = [
  { code: "EUR", name: "Euro" },
  { code: "USD", name: "Dollar américain" },
  { code: "GBP", name: "Livre sterling" },
  { code: "XOF", name: "Franc CFA" },
  { code: "JPY", name: "Yen japonais" },
  { code: "CAD", name: "Dollar canadien" },
  { code: "AUD", name: "Dollar australien" },
  { code: "CHF", name: "Franc suisse" },
  { code: "CNY", name: "Yuan chinois" },
  { code: "INR", name: "Roupie indienne" },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!amount) return;
    setIsLoading(true);
    setError(null);

    try {
      if (!process.env.NEXT_PUBLIC_API_KEY) {
        throw new Error(
          "Clé API manquante. Veuillez vérifier la configuration."
        );
      }

      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_API_KEY}/latest/${fromCurrency}`
      );

      if (!response.ok) {
        throw new Error("Échec de la requête. Vérifiez votre clé API.");
      }

      const data = await response.json();

      if (data.result === "error") {
        throw new Error(data["error-type"] || "Erreur inconnue.");
      }

      const rate = data.conversion_rates[toCurrency];
      const calculatedResult = parseFloat(amount) * rate;
      setResult(calculatedResult);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // debounce (500ms) pour éviter les requêtes multiples à chaque frappe
  useEffect(() => {
    if (!amount) return;

    const timer = setTimeout(() => {
      handleConvert();
    }, 500);

    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency]);

  // Inverser les devises
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-yellow-600">
        Convertisseur de devises
      </h2>

      <p className="text-center text-sm text-gray-500">
        Entrez un montant et choisissez les devises à convertir.
      </p>

      <div>
        <label
          htmlFor="montant"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Montant
        </label>
        <input
          id="montant"
          placeholder="Entrez un montant"
          type="number"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAmount(e.target.value)
          }
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fromCurrency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            De
          </label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFromCurrency(e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.name} ({currency.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="toCurrency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Vers
          </label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setToCurrency(e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            {currencies.map((currency) =>
              currency.code !== fromCurrency ? (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ) : null
            )}
          </select>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSwapCurrencies}
          className="mt-2 inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
        >
          ⇄ Inverser les devises
        </button>
      </div>

      {isLoading && (
        <div className="text-center mt-4 text-lg font-semibold text-yellow-600">
          Conversion en cours...
        </div>
      )}

      {result !== null && !isLoading && !error && (
        <div className="text-center mt-4 text-lg font-semibold">
          {amount} {fromCurrency} ={" "}
          <span className="text-yellow-600">
            {result.toFixed(2)} {toCurrency}
          </span>
        </div>
      )}

      {error && (
        <div className="text-center mt-4 text-red-600 font-medium">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
