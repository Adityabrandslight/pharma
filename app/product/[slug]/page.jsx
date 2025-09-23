    "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((json) => {
        const found = json.products.find((p) => p.slug === slug);
        setProduct(found || null);
      });
  }, [slug]);

  if (!product) return <div className="p-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-square bg-white rounded-lg border">
          <Image src={product.img} alt={product.name} fill className="object-contain p-4" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-sky-700">{product.name}</h1>
          <p className="text-sm text-slate-500">{product.category}</p>
          <div className="mt-3 text-lg font-semibold text-slate-900">₹{product.price}</div>
          {product.mrp > product.price && (
            <div className="text-sm text-slate-400 line-through">₹{product.mrp}</div>
          )}
          <p className="mt-4 text-slate-700">{product.content.shortDescription}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-8 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-sky-600">Key Benefits</h2>
          <ul className="list-disc pl-6 text-slate-700">
            {product.content.keyBenefits.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-sky-600">Key Features</h2>
          <ul className="list-disc pl-6 text-slate-700">
            {product.content.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-sky-600">Full Description</h2>
          <p className="text-slate-700 whitespace-pre-line">{product.content.longDescription}</p>
        </section>
      </div>
    </div>
  );
}
