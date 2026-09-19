"use client";

import { CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/customui/button";
import InputField from "@/components/customui/InputWithLabel";
import ModalSkeleton from "@/components/customui/ModalSkeleton";

export default function SerialCheckModal({
  serialNo,
  invoiceDate,
  message,
  isValid,
  isSubmitting,
  onRequestPickup,
}) {
  const Icon = isValid ? CheckCircle : XCircle;

  return (
    <ModalSkeleton
      title="Serial Number Validation"
      rolesAllowed={["distributor"]}
      size="content"
    >
      <div className="w-[34rem]">
        <div
          className={`mb-6 flex items-center gap-3 rounded-lg border p-4 ${
            isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
          }`}
        >
          <Icon
            className={`h-6 w-6 shrink-0 ${isValid ? "text-green-600" : "text-red-600"}`}
          />
          <p
            className={`text-sm font-semibold ${
              isValid ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputField label="Serial Number" value={serialNo || "-"} disabled />

          {isValid && (
            <InputField label="Invoice Date" value={invoiceDate || "-"} disabled />
          )}
        </div>

        {isValid && (
          <div className="mt-8 flex justify-end gap-4">
            <Button onClick={onRequestPickup} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request a pickup"}
            </Button>
          </div>
        )}
      </div>
    </ModalSkeleton>
  );
}
