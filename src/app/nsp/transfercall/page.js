"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Redux

import { useTheme } from "@/theme/ThemeContext";
import SideBar from "@/components/SideBar";
import axiosInstance from "@/api/axiosInstance";
import CustomDropdown from "@/components/common/Dropdown";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function TransferCallForm() {
  const { colors } = useTheme();

  // Redux selector to get user login details
  const user = useSelector((state) => state.auth.user); // Adjust slice name if needed
  const branchId = user?.branch_ID || 0;
  const roleName = user?.roleName || "";
  const sF_ID = user?.sF_ID || 0;
  const cat_MapID = user?.cat_MapID || 0;
  const asmid = user?.asmid || 0;

  // Form state
  const [ticketNo, setTicketNo] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [ascList, setAscList] = useState([]);
  const [ascOptions, setAscOptions] = useState([]);

  // Fetch ASC list dynamically based on branchId and roleName
  // useEffect(() => {
  //   if (!branchId || !roleName) return;

  //   const fetchAscList = async () => {
  //     try {
  //       const response = await axiosInstance.get(`/ASC_MASTER/role/${roleName}/${branchId}`);
  //       if (Array.isArray(response.data)) {
  //         setAscList(response.data);
  //         setAscOptions(
  //           response.data.map((asc) => ({ label: asc.ASC_NAME, value: asc.ASC_NAME }))
  //         );
  //       }
  //     } catch (error) {
  //       console.error('Error fetching ASC list:', error);
  //     }
  //   };

  //   fetchAscList();
  // }, [branchId, roleName]);

  useEffect(() => {
    if (!roleName) return;

    // Decide which ID to use
    let id = 0;
    if (branchId && branchId !== 0) id = branchId;
    else if (sF_ID && sF_ID !== 0) id = sF_ID;
    else if (cat_MapID && cat_MapID !== 0) id = cat_MapID;
    else if (asmid && asmid !== 0) id = asmid;

    if (id === 0) return; // nothing valid

    const fetchAscList = async () => {
      try {
        const response = await axiosInstance.get(`/ASC_MASTER/role/${roleName}/${id}`);

        if (Array.isArray(response.data)) {
          setAscList(response.data);
          setAscOptions(
            response.data.map((asc) => ({ label: asc.ASC_NAME, value: asc.ASC_NAME }))
          );
        }
      } catch (error) {
        console.error("Error fetching ASC list:", error);
      }
    };

    fetchAscList();
  }, [roleName, branchId, sF_ID, cat_MapID, asmid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticketNo || !transferTo) {
      setMessage({ type: "error", text: "Please fill all fields." });
      return;
    }

    const selectedAsc = ascList.find((asc) => asc.ASC_NAME === transferTo);

    if (!selectedAsc) {
      setMessage({ type: "error", text: "Please select a valid ASC." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        ticketNo,
        toSfId: selectedAsc.ASCINTCODE, // Use ASCINTCODE as ID
        transferBy: user?.userID || 0, // Logged-in user ID from Redux
        transferTo: selectedAsc.ASC_NAME,
      };

      const response = await axiosInstance.post("/CallTransfer/transfer", payload);

      setMessage({
        type: "success",
        text: response.data.status || "Call transferred successfully.",
      });
      setTicketNo("");
      setTransferTo("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["br", "asm", "zone"]}>
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />

        <div className="flex-1 pt-10 pr-20 pl-30">
          <div className="w-full">
            <div className="rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <h2
                className="mb-8 text-left text-2xl font-bold"
                style={{
                  color: colors.primary,
                  padding: 5,
                  fontWeight: 700,
                  fontSize: 18,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: 5,
                }}
              >
                Transfer Call
              </h2>

              {message && (
                <div
                  className={`mb-4 rounded px-4 py-2 ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form className="grid grid-cols-3 gap-6" onSubmit={handleSubmit}>
                {/* Complaint No */}
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Complaint No
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Complaint No"
                    className="rounded-lg border px-3 py-2 focus:outline-none"
                    value={ticketNo}
                    onChange={(e) => setTicketNo(e.target.value)}
                  />
                </div>

                {/* ASC Dropdown */}
                <CustomDropdown
                  label="Asc Name"
                  placeholder="Select ASC"
                  value={transferTo}
                  onChange={setTransferTo}
                  options={ascOptions}
                />

                {/* Buttons */}
                <div className="col-span-2 mt-6 flex gap-4">
                  <button
                    type="button"
                    className="rounded-lg px-6 py-2 text-sm font-medium shadow-md transition hover:shadow-lg"
                    style={{ background: colors.primary, color: "#fff" }}
                    onClick={() => window.history.back()}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg px-6 py-2 text-sm font-medium shadow-md transition hover:shadow-lg"
                    style={{ background: colors.primary, color: "#fff" }}
                    disabled={loading}
                  >
                    {loading ? "Transferring..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
