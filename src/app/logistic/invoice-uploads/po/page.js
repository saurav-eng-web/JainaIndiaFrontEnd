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

// Legacy GST/LogisticInvoiceUploader.aspx (sample GST/LogisticInvoicePO.xlsx) -> LogisticInvoicePOUploader.
const EXPECTED_HEADERS = ["InvoiceNo", "FromA", "Shipto", "TransporterName", "DocketNo", "VehicleType"];

export default function LogisticInvoicePoUploadPage() {
  return (
    <PageSkeleton title="Logistic Invoice Uploader" rolesAllowed={["logistic1"]} backHref="/logistic/invoice-uploads">
      <LogisticExcelUploader
        title="Upload Logistic Invoice Data"
        expectedHeaders={EXPECTED_HEADERS}
        endpoint="logistic/invoice-uploads/po"
        sampleFileName="LogisticInvoicePO.xlsx"
        mapRow={(get) => ({
          InvoiceNo: get("InvoiceNo"),
          FromA: get("FromA"),
          Shipto: get("Shipto"),
          TransporterName: get("TransporterName"),
          DocketNo: get("DocketNo"),
          VehicleType: get("VehicleType"),
        })}
        isRowEmpty={(r) => Object.values(r).every((v) => !v)}
      />
    </PageSkeleton>
  );
}
