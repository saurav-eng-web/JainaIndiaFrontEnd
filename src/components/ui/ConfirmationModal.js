import { CheckCircle2 } from "lucide-react";

import { Button } from "./button";

function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  type = "submit", // "submit" | "success"
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex min-h-[200px] w-[35rem] flex-col justify-between rounded-lg bg-white p-6">
        <div className={`${type === "success" ? "text-center" : ""}`}>
          {type === "success" ? (
            <>
              <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-600" />
              <h2 className="mb-2 text-lg font-semibold">{title}</h2>
              <p className="text-md text-gray-700">{message}</p>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-lg font-semibold">{title}</h2>
              <p className="text-md mb-4">{message}</p>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {type === "submit" ? (
            <>
              <Button className="h-9!" onClick={onCancel} variant="danger">
                No
              </Button>

              <Button className="h-9!" onClick={onConfirm}>
                Yes
              </Button>
            </>
          ) : (
            <Button onClick={onCancel}>OK</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

// import { Button } from "./button";

// function ConfirmModal({ open, title, message, onConfirm, onCancel, type = "submit" }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="flex min-h-[200px] w-[35rem] flex-col justify-between rounded-lg bg-white p-6">
//         <div className="">
//           <h2 className="mb-2 text-lg font-semibold">{title}</h2>
//           <p className="text-md mb-4">{message}</p>
//         </div>

//         <div className="flex justify-end gap-3">
//           {type === "submit" ? (
//             <>
//               <Button className="h-9!" onClick={onCancel} variant="danger">
//                 No
//               </Button>

//               <Button className="h-9!" onClick={onConfirm}>
//                 Yes
//               </Button>
//             </>
//           ) : (
//             <Button onClick={onCancel}>OK</Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ConfirmModal;
