"use client";

import { useState } from "react";

import CustomDropdown from "@/components/common/Dropdown";
import { Button } from "@/components/ui/button";
import InputWithLabel from "@/components/ui/InputWithLabel";
import PageSkeleton from "@/components/ui/PageSkeleton";
import Subheading from "@/components/ui/Subheading";

export default function ActionMasterPage() {
  // tabs: Create, Update
  const [activeTab, setActiveTab] = useState("create");
  return (
    <PageSkeleton title="Action Master">
      <div className="mb-6">
        <div className="flex items-end gap-1 border-b border-[#a6829d]/50 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`relative -mb-px h-8 min-w-32 rounded-t-lg px-5 py-2 text-sm font-semibold transition ${
              activeTab === "create"
                ? "z-10 border border-[#a6829d] border-b-white bg-white text-[#4a2f45] shadow-[0_-1px_0_0_#a6829d,0_-2px_10px_rgba(0,0,0,0.06)]"
                : "border border-transparent bg-[#f6f1f5] text-[#8b6f85] hover:text-[#4a2f45]"
            }`}
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("update")}
            className={`relative -mb-px h-8 min-w-32 rounded-t-lg px-5 py-2 text-sm font-semibold transition ${
              activeTab === "update"
                ? "z-10 border border-[#a6829d] border-b-white bg-white text-[#4a2f45] shadow-[0_-1px_0_0_#a6829d,0_-2px_10px_rgba(0,0,0,0.06)]"
                : "border border-transparent bg-[#f6f1f5] text-[#8b6f85] hover:text-[#4a2f45]"
            }`}
          >
            Update
          </button>
        </div>
      </div>
      {activeTab === "create" ? <CreateAction /> : <UpdateAction />}
    </PageSkeleton>
  );
}

function CreateAction() {
  const [filters, setFilters] = useState({
    role: "",
    product: "",
    callType: "",
    status: "",
    subStatus: "",
  });

  const [actionMaster, setActionMaster] = useState({
    action: "",
    actionStatus: "",
    actionSubStatus: "",
    type: "",
  });
  return (
    <div className="space-y-8">
      <section className="rounded-lg p-6 shadow">
        <Subheading title={"Payload"} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CustomDropdown
            placeholder="Select role"
            label={"Role"}
            value={filters.role}
            onChange={(value) => setFilters({ ...filters, role: value })}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Agent", value: "agent" },
            ]}
          />

          <CustomDropdown
            placeholder="Select product"
            value={filters.product}
            label={"Product"}
            onChange={(value) => setFilters({ ...filters, product: value })}
            options={[
              { label: "Loan", value: "loan" },
              { label: "Credit Card", value: "credit_card" },
            ]}
          />

          <CustomDropdown
            placeholder="Select call type"
            label={"Call Type"}
            value={filters.callType}
            onChange={(value) => setFilters({ ...filters, callType: value })}
            options={[
              { label: "Inbound", value: "inbound" },
              { label: "Outbound", value: "outbound" },
            ]}
          />

          <CustomDropdown
            placeholder="Select status"
            label={"Status"}
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={[
              { label: "Open", value: "open" },
              { label: "Closed", value: "closed" },
            ]}
          />

          <CustomDropdown
            placeholder="Select sub status"
            label={"Sub Status"}
            value={filters.subStatus}
            onChange={(value) => setFilters({ ...filters, subStatus: value })}
            options={[
              { label: "Pending", value: "pending" },
              { label: "Resolved", value: "resolved" },
            ]}
          />
        </div>
      </section>

      {/* Section 2: Action Master */}
      <section className="rounded-lg p-6 shadow">
        <Subheading title={"Action"} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InputWithLabel
            label="Action"
            placeholder="Enter action"
            value={actionMaster.action}
            onChange={(e) =>
              setActionMaster({
                ...actionMaster,
                action: e.target.value,
              })
            }
          />

          <InputWithLabel
            label="Action Status"
            placeholder="Enter action status"
            value={actionMaster.actionStatus}
            onChange={(e) =>
              setActionMaster({
                ...actionMaster,
                actionStatus: e.target.value,
              })
            }
          />

          <InputWithLabel
            label="Action Sub Status"
            placeholder="Enter action sub status"
            value={actionMaster.actionSubStatus}
            onChange={(e) =>
              setActionMaster({
                ...actionMaster,
                actionSubStatus: e.target.value,
              })
            }
          />

          <CustomDropdown
            placeholder="Select type"
            label="Type"
            value={actionMaster.type}
            onChange={(value) =>
              setActionMaster({
                ...actionMaster,
                type: value,
              })
            }
            options={[
              { label: "System", value: "system" },
              { label: "Manual", value: "manual" },
            ]}
          />
          <Button>submit</Button>
        </div>
      </section>
    </div>
  );
}

function UpdateAction() {
  return <div>Update Action</div>;
}
