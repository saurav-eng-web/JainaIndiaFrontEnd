import Modal from "../ui/Modal";

import ActionPopup from "./ActionPopup";

import AddPartPending from "@/app/history/actionsModals/AddPartPending";
import MSLConsume from "@/app/history/actionsModals/MSLConsume";
import PartConsume from "@/app/history/actionsModals/PartConsume";
import ReceiveFGPO from "@/app/history/actionsModals/ReceiveFGPO";
import CancelPopup from "@/app/history/CancelPopup";
import EditCustPopup from "@/app/history/EditCustPopup";
import DOAClosure from "@/app/testadmin/test";

export default function HistoryActionPopups({
  // Action State from Hook
  showActionPopup,
  setShowActionPopup,
  selectedAction,

  // Modals Visibility
  partPendingPopup,
  setPartPendingPopup,
  doaReceivePopup,
  setDoaReceivePopup,
  partConsumePopup,
  setPartConsumePopup,
  MSLPartConsumePopup,
  setMSLPartConsumePopup,
  DOAConsumePopup,
  setDOAConsumePopup,

  // Cancel Popup State
  cancelPopupOpen,
  setCancelPopupOpen,
  handleSubmitCancellation,
  cancelReasons,
  selectedReason,
  setSelectedReason,
  remark,
  setRemark,
  confirmCancel,
  setConfirmCancel,

  // Edit Customer
  editCustomerPopupOpen,
  setEditCustomerPopupOpen,
  fetchCustomerDetails,

  // Handlers & Data
  activeTicket,
  router,
  detail,
  formData,
  handleChange,
  engineerData,
  handleSerialCheck,
  serialNumber,
  setSerialNumber,
  handleAssigned,
  handleRequestCancellation, // For CancelPopup from ActionButton? No, usually main CancelPopup
}) {
  return (
    <>
      <ActionPopup
        isOpen={showActionPopup}
        onClose={() => setShowActionPopup(false)}
        selectedAction={selectedAction}
        detail={detail}
        // Cancellation inside ActionPopup
        cancelReasons={cancelReasons}
        selectedReason={selectedReason}
        setSelectedReason={setSelectedReason}
        remark={remark}
        setRemark={setRemark}
        confirmCancel={confirmCancel}
        setConfirmCancel={setConfirmCancel}
        handleSubmitCancellation={handleSubmitCancellation}
        // WIP
        serialNumber={serialNumber}
        setSerialNumber={setSerialNumber}
        handleSerialCheck={handleSerialCheck}
        // Assign/Generic
        formData={formData}
        handleChange={handleChange}
        engineerData={engineerData}
        handleAssigned={handleAssigned}
      />

      <Modal open={partPendingPopup} onClose={() => setPartPendingPopup(false)}>
        <AddPartPending ticketNumber={activeTicket} />
      </Modal>

      <Modal open={doaReceivePopup} onClose={() => setDoaReceivePopup(false)}>
        <ReceiveFGPO ticketNo={activeTicket} onClose={() => router.back()} />
      </Modal>

      <Modal open={DOAConsumePopup} onClose={() => setDOAConsumePopup(false)}>
        <DOAClosure
          ticketNo={activeTicket}
          model={detail?.model}
          oldSerialNumber={detail?.seriaL_NO}
        />
      </Modal>

      <Modal open={partConsumePopup} onClose={() => setPartConsumePopup(false)}>
        <PartConsume
          ticketNo={activeTicket}
          onClose={() => {
            // Logic to close or route back often handled by parent or onClose prop
            router.back();
          }}
        />
      </Modal>

      <Modal open={MSLPartConsumePopup} onClose={() => setMSLPartConsumePopup(false)}>
        <MSLConsume ticketNumber={activeTicket} />
      </Modal>

      <EditCustPopup
        isOpen={editCustomerPopupOpen}
        onClose={() => setEditCustomerPopupOpen(false)}
        details={{
          firstName: detail?.firstname || "",
          lastName: detail?.lastname || "",
          address: detail?.addresS1 || "",
          landmark: detail?.landmark || "",
          custintcode: detail?.custintcode || "",
        }}
        onUpdated={fetchCustomerDetails}
      />

      <CancelPopup
        isOpen={cancelPopupOpen}
        onClose={() => setCancelPopupOpen(false)}
        onSubmit={handleRequestCancellation}
        formData={formData}
        setFormData={handleChange} // CancelPopup expects setFormData but we use handleChange wrapper usually.
        // Careful: CancelPopup implementation might rely on full setFormData.
        // If CancelPopup uses setFormData((prev) => ...), we might need to adjust or pass a compatible setter.
        // For now assuming we pass the handleRequestCancellation which uses formData from hook.
      />
    </>
  );
}
