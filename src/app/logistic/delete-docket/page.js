"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

import axiosInstance from "@/api/axiosInstance";
import PageSkeleton from "@/components/customui/PageSkeleton";
import Subheading from "@/components/customui/Subheading";
import Table from "@/components/common/Table";
import { Button } from "@/components/customui/button";

export default function DeleteDocketPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Legacy DeleteDocket.aspx loaded the full grid on first open.
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e) {
    e?.preventDefault();
    // Legacy: an empty search box re-binds the full list (BindGrid), otherwise filters by docket number.

    try {
      setIsLoading(true);
      // Legacy DeleteDocket.aspx: DocMaster_Proc SELECT, @Search = docket number when filled
      const res = await axiosInstance.get("logistic/dockets", {
        params: searchTerm?.trim() ? { search: searchTerm.trim() } : {},
      });
      setData(res.data || []);
      if (res.data?.length === 0) {
        toast("No records found.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch dockets.");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteConfirmId) return;

    try {
      setIsDeleting(true);
      await axiosInstance.delete(`logistic/dockets/${deleteConfirmId}`);
      toast.success("Docket deleted successfully!");
      setDeleteConfirmId(null);
      // Refresh the list
      handleSearch();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete docket.");
    } finally {
      setIsDeleting(false);
    }
  }

  const columns = [
    { label: "ID", key: "id", size: "sm" },
    { label: "Docket No", key: "docketNo", size: "md" },
    { label: "Challan No", key: "challanNo", size: "md" },
    { label: "Type", key: "type", size: "sm" },
    { label: "Courier Code", key: "courierCode", size: "md" },
    { label: "Pickup Date", key: "pickupDate", size: "md" },
    { label: "Delivery Date", key: "deliveryDate", size: "md" },
    { label: "Status", key: "docStatus", size: "sm" },
    {
      label: "Action",
      key: "action",
      size: "sm",
      render: (_, row) => (
        <button
          onClick={() => setDeleteConfirmId(row.id)}
          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
        >
          <Trash2 size={16} /> Delete
        </button>
      ),
    },
  ];

  return (
    <PageSkeleton title="Search & Delete Docket" rolesAllowed={["logistic"]} backHref="/logistic/dashboard">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <Subheading title="Search Docket" />
        <form onSubmit={handleSearch} className="mt-4 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Docket Number / Challan Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Docket Number (leave blank for all)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-auto">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </div>

      {(data.length > 0 || isLoading) && (
        <div>
          <Subheading title="Search Results" />
          <div className="mt-4">
            <Table columns={columns} rows={data} isLoading={isLoading} />
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this docket? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageSkeleton>
  );
}
