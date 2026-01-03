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

export default function SpeicalApprovalPopup({ ticketNo }) {
  const { colors } = useTheme();
  // const user = useSelector((state) => state.auth.user);

  const [allowanceType, setAllowanceType] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [allowanceTypeOptions, setAllowanceTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const fetchAllowanceTypes = async () => {
      if (!ticketNo) return;
      try {
        setIsLoading(true);
        const res = await axiosInstance.post("DropdownMaster/GetDropdown", {
          type: "specialallowance",
          dispatchtype: ticketNo,
        });

        if (!isMounted) return;
        setAllowanceTypeOptions(
          res.data?.statusCode === 200
            ? res.data?.data.map((el) => {
                return { label: el.value, value: el.value };
              })
            : []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllowanceTypes();

    return () => {
      isMounted = false;
    };
  }, [ticketNo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!allowanceType || !amount || !remarks) {
      toast.error("Please fill in all the fields");
      // alert("Please fill in all the fields");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axiosInstance.post("SpecialAllowance/manage", {
        Action: "INSERT",
        Ticket_No: ticketNo,
        SpecialApprovaltype: allowanceType,
        NSPRequestAmount: amount,
        NSPRemarks: remarks,
      });

      if (res.data.statusCode === 200) {
        toast.success("Request submitted successfully!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/nsp/special-approval");
        // alert(res.data.statusMsg);
      } else {
        toast.error("Failed to submit. Please try again.");
        console.error(res.data.statusMsg);
      }
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["br", "nsp"]}>
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

            {/* ---------------- FILTER SECTION ---------------- */}
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="grid grid-cols-3 gap-6">
                <CustomDropdown
                  label="Special Allowance Type"
                  placeholder="Select Allowance Type"
                  value={allowanceType}
                  onChange={setAllowanceType}
                  options={allowanceTypeOptions}
                />

                <InputField
                  label="Amount"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  // className={"ml-8"}
                  required={true}
                />
                {/* <TextArea
                  label="Remarks"
                  placeholder="Enter remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  // className={"h-11"}
                /> */}
              </div>
              <TextArea
                label="Remarks"
                placeholder="Enter remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className={"mt-4"}
              />

              <Button className="mt-6">Submit</Button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
