"use client";

import { useEffect, useState } from 'react';

interface Customer {
  [key: string]: any;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/customers')
      .then(res => {
        if (!res.ok) throw new Error('خطا در دریافت داده‌ها');
        return res.json();
      })
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8">در حال بارگذاری...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  if (customers.length === 0) return <div className="text-center py-8">مشتری‌ای یافت نشد.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">لیست مشتریان</h1>
      <div className="overflow-x-auto rounded-xl shadow border">
        <table className="min-w-full bg-white text-right">
          <thead className="bg-green-100">
            <tr>
              {Object.keys(customers[0]).map(key => (
                <th key={key} className="py-2 px-4 font-bold border-b">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr key={idx} className="even:bg-green-50 hover:bg-green-200/40 transition-colors">
                {Object.values(customer).map((val, i) => (
                  <td key={i} className="py-2 px-4 border-b">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 