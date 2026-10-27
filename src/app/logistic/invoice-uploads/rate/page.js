"use client";

/**
 * Modification History:
 * -----------------------------------------------------------------------------
 * Date         Author   Purpose
 * -----------------------------------------------------------------------------
 * 26-Oct-2026  Saurav   Created for Logistic Module
 * -----------------------------------------------------------------------------
 */

import PageSkeleton from "@/components/customui/PageSkeleton";
import LogisticExcelUploader from "@/components/logistic/LogisticExcelUploader";

// Legacy GST/LogisticInvoiceRateUploader.aspx (sample GST/LogisticInvoiceRate.xlsx) -> LogisticInvoiceRateUploader.
const EXPECTED_HEADERS = ["FromA", "ToA", "Transporter", "VehicleType", "Rate"];

export default function LogisticInvoiceRateUploadPage() {
  return (
    <PageSkeleton title="Logistic Invoice Rate Uploader" rolesAllowed={["logistic1"]} backHref="/logistic/invoice-uploads">
      <LogisticExcelUploader
        title="Upload Logistic Invoice Rates"
        expectedHeaders={EXPECTED_HEADERS}
        endpoint="logistic/invoice-uploads/rate"
        sampleFileName="LogisticInvoiceRate.xlsx"
        mapRow={(get) => ({
          FromA: get("FromA"),
          ToA: get("ToA"),
          Transporter: get("Transporter"),
          VehicleType: get("VehicleType"),
          Rate: get("Rate"),
        })}
        isRowEmpty={(r) => Object.values(r).every((v) => !v)}
      />
    </PageSkeleton>
  );
}
