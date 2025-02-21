import { useState, useEffect } from "react";

export default function App() {
  const [jsonInput, setJsonInput] = useState('{"data": ["M","1","334","4","B"]}');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "22BCS17062";
  }, []);

  const validateInput = (input) => {
    try {
      const parsed = JSON.parse(input);
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error("Input must contain a 'data' field with an array");
      }

      const invalidItems = parsed.data.filter(item => {
        const isNumber = /^\d+$/.test(item);
        const isSingleLetter = /^[A-Za-z]$/.test(item);
        return !isNumber && !isSingleLetter;
      });
      
      if (invalidItems.length > 0) {
        throw new Error("All items must be either numbers or single letters");
      }
      return parsed;
    } catch (error) {
      throw new Error(`Invalid input: ${error.message}`);
    }
  };

  const fetchData = async () => {
    try {
      setError("");
      const parsedInput = validateInput(jsonInput);
      
      const res = await fetch("https://bajajfinser.onrender.com/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedInput),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Server error");
      }
      
      setResponse(data);
    } catch (error) {
      setError(error.message);
      setResponse(null);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">BFHL Challenge</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">JSON Input:</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Example: {"data": ["M","1","334","4","B"]}'
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <button 
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={fetchData}
      >
        Submit
      </button>

      {response && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Response:</h2>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
