"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import OKPopup from "../history/actionsModals/OK";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import PageSkeleton from "@/components/ui/PageSkeleton";

export default function Page() {
  const [okpup, setokpup] = useState(false);
  console.log("okpup: ", okpup);

  return (
    <PageSkeleton title={"test page"} rolesAllowed={["sf/ssd", "asm", "zone", "br"]}>
      <header>
        <h2 class="border-primary w-full border-b pb-3 text-xl font-bold text-gray-900 dark:text-white">
          Complaint Details
        </h2>
      </header>

      <div className="grid min-h-screen grid-cols-12 gap-4">
        <Button
          onClick={() => {
            setokpup(true);
            toast.success("OK Popup opened");
            console.log("okpup: ", okpup);
          }}
        >
          Call OK
        </Button>
      </div>

      <div class="group bg-red- mb-6 flex items-center gap-3">
        <h2 class="text-lg font-bold whitespace-nowrap text-gray-800 dark:text-gray-100">
          Complaint Details
        </h2>
        <div class="group-hover:bg-primary/30 h-px w-full bg-gray-200 transition-colors duration-300 dark:bg-gray-700"></div>
      </div>
      <Modal open={okpup} onClose={() => setokpup(false)}>
        <OKPopup ticketNo={"TEST1234"} />
      </Modal>
    </PageSkeleton>
  );
}
