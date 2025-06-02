import { useState, useEffect } from "react";
import axios from "axios";

const HYPERMARKETS = {
  Carrefour: [
    "CARREFOUR POLONIA DE CDO. RIVADAVIA",
    "EXPRESS BARILOCHE (149)",
    "EXPRESS CAMPANA II(PANAMERICANA)232",
    // [... otras 80 sucursales truncadas para brevedad ...]
    "EXPRESS HURLINGHAM (218)"
  ],
  Yaguar: [
    "BAHIA BLANCA",
    "CABA - AUTOPISTA",
    "CABA - CABALLITO",
    "CAMPANA",
    "CÓRDOBA",
    "GODOY CRUZ",
    "JOSE C PAZ",
    "MAR DEL PLATA",
    "MASCHWITZ",
    "MORENO",
    "NEUQUEN",
    "RESISTENCIA",
    "SALTA",
    "SAN JUAN",
    "SANTA FE",
    "TIGRE",
    "TRELEW"
  ],
  Makro: [
    "AVELLANEDA",
    "BAHIA BLANCA",
    "BENAVIDEZ",
    "CORDOBA COLÓN",
    "CORDOBA NORTE",
    "CORRIENTES",
    "HAEDO",
    "ITUZAINGO",
    "LOMAS DE ZAMORA",
    "MAR DEL PLATA",
    "MENDOZA",
    "NEUQUEN",
    "OLIVOS",
    "PILAR",
    "QUILMES",
    "RIO CUARTO",
    "ROSARIO",
    "SALTA",
    "SAN JUAN",
    "SAN JUSTO",
    "SAN MARTIN",
    "SANTA FE",
    "TUCUMAN"
  ],
  Maycar: [
    "QUILMES",
    "PILAR",
    "AVELLANEDA",
    "NEUQUEN",
    "RESISTENCIA",
    "ABASTO",
    "LAFERRERE",
    "LOMA HERMOSA",
    "MORENO",
    "MALVINAS ARGENTINAS",
    "EL TALAR - PACHECO",
    "VILLA ORTUZAR",
    "BURZACO",
    "POSADAS",
    "LA PLATA",
    "SALTA",
    "SANTA FE",
    "BAHIA BLANA",
    "SAN JUSTO",
    "MAR DEL PLATA"
  ]
};

export default function FormularioPDV() {
  const [hyper, setHyper] = useState("Carrefour");
  const [branch, setBranch] = useState("");
  const [product, setProduct] = useState("");
  const [obs, setObs] = useState("");
  const [before, setBefore] = useState<File | null>(null);
  const [after, setAfter] = useState<File | null>(null);

  const products = ["Cutex", "Colorsilk", ...(hyper === "Carrefour" ? ["Esmaltes Duo Pack", "Balsamos"] : [])];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!before || !after) return alert("Subí ambas fotos");

    const formData = new FormData();
    formData.append("hypermarket", hyper);
    formData.append("branch", branch);
    formData.append("product", product);
    formData.append("observation", obs);
    formData.append("before", before);
    formData.append("after", after);

    try {
      const res = await axios.post("https://backend-pdv-vercel.vercel.app/api/generate", formData, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `informe-${branch}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Error generando el informe");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Formulario PDV</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select value={hyper} onChange={(e) => setHyper(e.target.value)} className="border p-2">
          {Object.keys(HYPERMARKETS).map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>

        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="border p-2">
          <option value="">Seleccioná sucursal</option>
          {HYPERMARKETS[hyper].map((suc) => (
            <option key={suc}>{suc}</option>
          ))}
        </select>

        <select value={product} onChange={(e) => setProduct(e.target.value)} className="border p-2">
          <option value="">Seleccioná producto</option>
          {products.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <textarea
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          placeholder="Observaciones"
          className="border p-2"
        />

        <label>Foto Antes</label>
        <input type="file" accept="image/*" onChange={(e) => setBefore(e.target.files?.[0] || null)} />

        <label>Foto Después</label>
        <input type="file" accept="image/*" onChange={(e) => setAfter(e.target.files?.[0] || null)} />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enviar y Generar PDF
        </button>
      </form>
    </div>
  );
}
