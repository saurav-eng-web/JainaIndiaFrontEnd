"use client";
import React from "react";

import Popup from "@/components/common/Popup";
import SectionHeading from "@/components/common/SectionHeading";
import Table from "@/components/common/Table";
import ThemedButton from "@/components/common/ThemedButton";
import { Button } from "@/components/ui/button";

const ComponentName = () => {
  // Define the mapping here
  const columnConfig = [
    { label: "Username", key: "Name", size: "sm" }, // Label is "Username", but look for "Name" in data
    { label: "Email", key: "Email", size: "xl" },
    { label: "Phone", key: "Phone", size: "md" },
    { label: "Category", key: "Test", size: "xs" },
    { label: "Status", key: "New", size: "sm" },
  ];

  const rows = [
    // {
    //   Name: "test1",
    //   Email: "test1@gmail.com",
    //   Phone: "1234",
    //   Test: "Admin",
    //   New: "Active",
    // },
    // {
    //   Name: "test2",
    //   Email: "test2@gmail.com",
    //   Phone: "5678",
    //   Test: "User",
    //   New: "Pending",
    // },
  ];

  // Usage

  return (
    <>
      <div className="bg-yellow-500">Admin</div>
      <Popup />
      <SectionHeading>
        test
        <div>test</div>
        <p>new</p>
      </SectionHeading>
      <ThemedButton>test</ThemedButton>
      <Button>test</Button>
      <Table columns={columnConfig} rows={rows} />;
    </>
  );
};

export default ComponentName;
