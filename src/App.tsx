import { useState, useEffect } from "react";
import { planGasMixPercent } from "./utils/api";

import "./App.css";

function App() {
  const [inputs, setInputs] = useState({
    P_residual: 0,
    O2_pct_residual: 21,
    He_pct_residual: 0,
    P_total: 200,
    O2_pct_target: 21,
    He_pct_target: 0,
  });

  const [results, setResults] = useState({
    O2_fill: 0,
    He_fill: 0,
    Air_fill: 0,
    FO2_final: 0,
    FHe_final: 0,
    FN2_final: 0,
    MOD_1_4: 0,
    MOD_1_6: 0,
  });

  useEffect(() => {
    const result = planGasMixPercent({
      ...inputs,
      N2_pct_residual: 100 - inputs.O2_pct_residual - inputs.He_pct_residual,
      N2_pct_target: 100 - inputs.O2_pct_target - inputs.He_pct_target,
    });
    setResults(result);
  }, [inputs]);

  const handleInputChange = (name: string, value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));
    }
  };

  return (
    <>
      <header>
        <h1 className="text-4xl font-bold text-center">GAS MIX CALCULATOR</h1>
        <p className="text-sm text-center mb-8">&copy; Taehoon Kwon</p>
      </header>

      <main className="container flex flex-col md:flex-row gap-4 md:gap-8 px-4 md:px-0">
        <section className="flex flex-col w-full md:min-w-80 md:min-h-96 border-2 p-4 gap-4">
          <div className="flex items-center gap-2 mb-2">
            <label id="P_total" className="text-xl w-32">
              Desired Mix
            </label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-20 h-8"
              value={inputs.P_total}
              onChange={(e) => handleInputChange("P_total", e.target.value)}
            />
            <span>bar</span>
          </div>
          <div className="flex items-center gap-2">
            <label id="O2_pct_target" className="text-xl w-32">
              O2
            </label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-20 h-8"
              value={inputs.O2_pct_target}
              onChange={(e) =>
                handleInputChange("O2_pct_target", e.target.value)
              }
            />
            <span>%</span>
          </div>
          <div className="flex items-center gap-2">
            <label id="N2_pct_target" className="text-xl w-32">
              N2
            </label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-20 h-8"
              value={100 - inputs.O2_pct_target - inputs.He_pct_target}
              disabled
            />
            <span>%</span>
          </div>
          <div className="flex items-center gap-2">
            <label id="He_pct_target" className="text-xl w-32">
              He
            </label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-20 h-8"
              value={inputs.He_pct_target}
              onChange={(e) =>
                handleInputChange("He_pct_target", e.target.value)
              }
            />
            <span>%</span>
          </div>
        </section>

        <section className="flex flex-col w-full md:min-w-80 md:min-h-96 border-2 p-4 gap-4">
          <div className="flex items-center gap-2 mb-2">
            <label id="P_residual" className="text-xl w-32">
              Residual Gas
            </label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-20 h-8"
              value={inputs.P_residual}
              onChange={(e) => handleInputChange("P_residual", e.target.value)}
            />
            <span>bar</span>
          </div>
          <div className="flex items-center gap-2">
            <label id="O2_pct_residual" className="text-xl w-32">
              O2
            </label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-20 h-8"
              value={inputs.O2_pct_residual}
              onChange={(e) =>
                handleInputChange("O2_pct_residual", e.target.value)
              }
            />
            <span>%</span>
          </div>
          <div className="flex items-center gap-2">
            <label id="N2_pct_residual" className="text-xl w-32">
              N2
            </label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-20 h-8"
              value={100 - inputs.O2_pct_residual - inputs.He_pct_residual}
              disabled
            />
            <span>%</span>
          </div>
          <div className="flex items-center gap-2">
            <label id="He_pct_residual" className="text-xl w-32">
              He
            </label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-20 h-8"
              value={inputs.He_pct_residual}
              onChange={(e) =>
                handleInputChange("He_pct_residual", e.target.value)
              }
            />
            <span>%</span>
          </div>
        </section>

        <section className="flex flex-col w-full md:min-w-80 md:min-h-96 border-2 p-4 gap-4">
          <span className="text-xl mb-2">Pressure Add or Subtract</span>
          <div className="flex items-center gap-2">
            <label id="O2_fill" className="text-xl w-32">
              O2
            </label>
            <span className="w-20 text-right">
              {results.O2_fill.toFixed(1)}
            </span>
            <span>bar</span>
          </div>
          <div className="flex items-center gap-2">
            <label id="Air_fill" className="text-xl w-32">
              Air
            </label>
            <span className="w-20 text-right">
              {results.Air_fill.toFixed(1)}
            </span>
            <span>bar</span>
          </div>
          <div className="flex items-center gap-2">
            <label id="He_fill" className="text-xl w-32">
              He
            </label>
            <span className="w-20 text-right">
              {results.He_fill.toFixed(1)}
            </span>
            <span>bar</span>
          </div>
          <span className="text-xl my-2">O2 Depth Limits</span>
          <div className="flex items-center gap-2">
            <label id="MOD_1_4" className="text-xl w-32">
              Floor 1.4
            </label>
            <span className="w-20 text-right">
              {results.MOD_1_4.toFixed(1)}
            </span>
            <span>m</span>
          </div>
          <div className="flex items-center gap-2">
            <label id="MOD_1_6" className="text-xl w-32">
              Floor 1.6
            </label>
            <span className="w-20 text-right">
              {results.MOD_1_6.toFixed(1)}
            </span>
            <span>m</span>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
