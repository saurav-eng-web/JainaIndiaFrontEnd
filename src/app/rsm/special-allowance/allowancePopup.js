"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CustomDropdown from "@/components/common/Dropdown";
import { useTheme } from "@/theme/ThemeContext";
import InputField from "@/components/ui/InputWithLabel";
import TextArea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";

export default function SpeicalAllowancePopup({ ticketNo }) {
  const { colors } = useTheme();
  // const user = useSelector((state) => state.auth.user);

  //   const [allowanceType, setAllowanceType] = useState("");
  //   const [allowanceTypeOptions, setAllowanceTypeOptions] = useState([]);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //   const nspRemarks =
  //     "Please allow this request as we can hjgjkl lkjh kh lkj hkjhlkjhlkjh kjh klhkj hkl jhk ljh lkjh kjlhkjhjhkjl";
  //   const nspAmount = 1500;
  //   const nspType = "Transport";
  const router = useRouter();

  const nspData = useSelector((state) => state.routeData.store.nspData);
  const locationData = useSelector((state) => state.routeData.store.allowanceData);

  useEffect(() => {
    if (!nspData) {
      router.replace("/rsm/special-allowance");
    }
  }, [nspData]);

  const { nspAmount, nspRemarks, nspAllowanceType } = nspData;

  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchAllowanceTypes = async () => {
  //     if (!ticketNo) return;
  //     try {
  //       setIsLoading(true);
  //       const res = await axiosInstance.post("DropdownMaster/GetDropdown", {
  //         type: "specialallowance",
  //         dispatchtype: ticketNo,
  //       });
  //       console.log("data: ", res);

  //       if (!isMounted) return;
  //       setAllowanceTypeOptions(
  //         res.data?.statusCode === 200
  //           ? res.data?.data.map((el) => {
  //               return { label: el.value, value: el.value };
  //             })
  //           : []
  //       );
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchAllowanceTypes();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [ticketNo]);

  if (!nspData) {
    return null; // or loader
  }

  const handleApprove = async () => {
    if (isLoading) return;

    if (!amount || !remarks) {
      toast.error("Please fill in all the fields");
      return;
    }

    if (amount > nspAmount) {
      toast.error("Invalid Amount!\nThe amount can't be greater than requested amount");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axiosInstance.post("SpecialAllowance/manage", {
        Action: "UPDATERSM",
        Ticket_No: ticketNo,
        RSMApproveAmount: amount,
        RSMRemarks: remarks,
        sa_status: "ApprovedbyRSM",
      });

      if (res.data.statusCode === 200) {
        toast.success("Request approved successfully!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/rsm/special-allowance");
      } else {
        toast.error("Failed to Approve. Please try again.");
        console.error(res.data.statusMsg);
      }
    } catch (error) {
      toast.error("Failed to Approve. Please try again.");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (isLoading) return;

    if (!remarks) {
      toast.error("Please enter remarks");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axiosInstance.post("SpecialAllowance/manage", {
        Action: "UPDATERSM",
        Ticket_No: ticketNo,
        RSMApproveAmount: amount || 0,
        RSMRemarks: remarks,
        sa_status: "RejectedbyRSM",
      });

      if (res.data.statusCode === 200) {
        toast.success("Request rejected successfully!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/rsm/special-allowance");
      } else {
        toast.error("Failed to reject, Please try again.");
        console.error(res.data.statusMsg);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["zone"]}>
      <div className="flex h-auto w-full max-w-2xl min-w-[1000px] overflow-y-auto rounded-xl">
        <div className="flex-1">
          {/* <div className="flex-1 pt-10 pr-20 pl-30"> */}
          <div className="w-full rounded-xl bg-white p-8 shadow-lg">
            <h2
              className="mb-8 text-2xl font-bold"
              style={{
                color: colors.primary,
                border: `2px solid ${colors.primary}`,
                padding: 5,
                borderRadius: 6,
                fontSize: 18,
              }}
            >
              Special Allowance
            </h2>

            <div className="mb-6 rounded-xl border border-[#D9D9D9] px-4 pt-2 pb-4">
              <h2 className="mb-2 text-lg font-bold text-[#734d69]">Requested Data</h2>
              <div className="grid grid-cols-3">
                <div className="flex gap-2">
                  <p className="font-semibold">Amount: </p>
                  <p>{nspAmount || "-"}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold">Type: </p>
                  <p>{nspAllowanceType || "-"}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold">Remarks: </p>
                  <p>{nspRemarks || "-"}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold">Cust. Pincode: </p>
                  <p>{locationData.pincode || "-"}</p>
                </div>{" "}
                <div className="flex gap-2">
                  <p className="font-semibold">SC Pincode: </p>
                  <p>{locationData.asC_Pincode || "-"}</p>
                </div>{" "}
                <div className="flex gap-2">
                  <p className="font-semibold">Distance: </p>
                  <p>{locationData.distance || "-"}</p>
                </div>
              </div>
            </div>

            {/* ---------------- FILTER SECTION ---------------- */}

            <div className="grid grid-cols-2 gap-6">
              {/* <CustomDropdown
                label="Special Allowance Type"
                placeholder="Select Allowance Type"
                value={allowanceType}
                onChange={setAllowanceType}
                options={allowanceTypeOptions}
              /> */}

              {/* <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="rounded-lg px-6 py-2 shadow-md"
                  style={{ background: colors.primary, color: "#fff" }}
                >
                  Search
                </button>
              </div> */}

              {/* <div className="flex items-end">
                <label className="mr-2 block font-medium">Amount</label>
                <input type="number" placeholder="Enter amount" />
              </div> */}
              <InputField
                label="Amount"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                required={true}
              />
              <TextArea
                label="Remarks"
                placeholder="Enter remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required={true}
              />
            </div>

            <div className="flex justify-end">
              <Button variant="danger" onClick={handleReject} className="mt-6 mr-4 w-24">
                Reject
              </Button>
              <Button onClick={handleApprove} className="mt-6 w-24">
                Approve
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
