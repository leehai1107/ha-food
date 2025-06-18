"use client";

import { Discount } from "@/types/product";
import {
  createDiscount,
  deleteDiscount,
  getDiscounts,
  updateDiscount,
} from "@/services/productService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DiscountsPage() {
  const router = useRouter();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newDiscount, setNewDiscount] = useState({
    minQuantity: 5,
    discountPercent: 8,
    isActive: true,
  });

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await getDiscounts();
        if (response.success) {
          setDiscounts(response.data);
        }
      } catch (err) {
        setError("Failed to load discounts");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const handleCreateDiscount = async () => {
    try {
      const response = await createDiscount(newDiscount);
      if (response.success) {
        setDiscounts([...discounts, response.data]);
        setNewDiscount({
          minQuantity: 5,
          discountPercent: 8,
          isActive: true,
        });
      }
    } catch (err) {
      setError("Failed to create discount");
    }
  };

  const handleUpdateDiscount = async (
    discountId: number,
    updates: Partial<Discount>
  ) => {
    try {
      const response = await updateDiscount(discountId, updates);
      if (response.success) {
        setDiscounts(
          discounts.map((d) => (d.id === discountId ? response.data : d))
        );
      }
    } catch (err) {
      setError("Failed to update discount");
    }
  };

  const handleDeleteDiscount = async (discountId: number) => {
    try {
      const response = await deleteDiscount(discountId);
      if (response.success) {
        setDiscounts(discounts.filter((d) => d.id !== discountId));
      }
    } catch (err) {
      setError("Failed to delete discount");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bulk Discounts Management</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {/* Add New Discount */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Discount Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Quantity
            </label>
            <input
              type="number"
              value={newDiscount.minQuantity}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  minQuantity: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount Percentage
            </label>
            <input
              type="number"
              value={newDiscount.discountPercent}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  discountPercent: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCreateDiscount}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Add Discount Tier
            </button>
          </div>
        </div>
      </div>

      {/* Discounts List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Minimum Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount Percentage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={discount.minQuantity}
                    onChange={(e) =>
                      handleUpdateDiscount(discount.id, {
                        minQuantity: parseInt(e.target.value),
                      })
                    }
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    min="1"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={discount.discountPercent}
                    onChange={(e) =>
                      handleUpdateDiscount(discount.id, {
                        discountPercent: parseFloat(e.target.value),
                      })
                    }
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={discount.isActive}
                      onChange={(e) =>
                        handleUpdateDiscount(discount.id, {
                          isActive: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {discount.isActive ? "Active" : "Inactive"}
                    </span>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteDiscount(discount.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
