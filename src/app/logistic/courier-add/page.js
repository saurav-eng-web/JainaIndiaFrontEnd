"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/api/axiosInstance";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";

export default function CourierAddPage() {
  const [courierName, setCourierName] = useState("");
  const [courierCode, setCourierCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [couriers, setCouriers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCouriers();
  }, []);

  async function fetchCouriers() {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("logistic/couriers");
      setCouriers(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch couriers.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!courierName.trim() || !courierCode.trim()) {
      toast.error("Please fill both Courier Name and Courier Code.");
      return;
    }

    try {
      setIsSaving(true);
      const res = await axiosInstance.post("logistic/couriers", {
        CourierName: courierName.trim(),
        CourierCode: courierCode.trim(),
      });
      toast.success(res.data?.message || "Courier added successfully!");
      setCourierName("");
      setCourierCode("");
      
      // Refresh the grid
      fetchCouriers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add courier.");
    } finally {
      setIsSaving(false);
    }
  }

  const columns = [
    { key: "courierCode", label: "Courier Code" },
    { key: "courierName", label: "Courier Name" },
  ];

  return (
    <PageSkeleton title="Courier Master" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ADD FORM */}
        <div>
          <Subheading title="Add New Courier" />
          <form onSubmit={handleSave} className="mt-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Courier Name
              </label>
              <input
                type="text"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Blue Dart"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Courier Code
              </label>
              <input
                type="text"
                value={courierCode}
                onChange={(e) => setCourierCode(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. BDT"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Courier"}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setCourierName(""); setCourierCode(""); }}>
                Reset
              </Button>
            </div>
          </form>
        </div>

        {/* LISTING */}
        <div>
          <Subheading title="Existing Couriers" />
          <div className="mt-4">
            <Table columns={columns} rows={couriers} isLoading={isLoading} />
          </div>
        </div>

      </div>
    </PageSkeleton>
  );
}
