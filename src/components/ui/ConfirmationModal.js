import { Button } from "./button";

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded-lg bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold">{title}</h2>
        <p className="mb-4 text-sm text-gray-600">{message}</p>

        <div className="flex justify-end gap-3">
          {/* <button className="rounded bg-gray-200 px-4 py-2" onClick={onCancel}>
            No
          </button> */}

          {/* <button className="rounded bg-red-600 px-4 py-2 text-white" onClick={onConfirm}>
            Yes
          </button> */}
          <Button onClick={onCancel} variant="danger">
            No
          </Button>

          <Button onClick={onConfirm}>Yes</Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
