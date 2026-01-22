import clsx from "clsx";
import React from "react";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  readOnly = false,
  className = "",
  inputClassName = "",
  rows = 3,
  ...props
}) => {
  const isTextarea = type === "textarea";

  const baseClasses =
    "w-full rounded border border-gray-400 p-2 outline-none focus:ring-1 focus:ring-gray-400 transition-all";
  const stateClasses = readOnly
    ? "cursor-not-allowed bg-gray-100 text-gray-600"
    : "bg-white text-gray-800";

  return (
    <div className={className}>
      {label && <label className="mb-1 block font-medium text-gray-700">{label}</label>}
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          readOnly={readOnly}
          className={clsx(baseClasses, stateClasses, "resize-none", inputClassName)}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={clsx(baseClasses, stateClasses, inputClassName)}
          {...props}
        />
      )}
    </div>
  );
};

export default FormInput;

/*
we need the below columns, in the braces are the key that we have to map:
Sr. No (pC_ID)
Part Code(pC_PartCode)
Description(pC_PartDesc)
Date(pC_Date, format: 2024-10-11T17:25:28.41, we need it dd-mm-yyyy in indian format)
Rate(pC_Rate)
Quantity(pC_Quantity)
Amount(pC_Amount)
Fresh Faulty(isFreshFaulty, we have to show Yes/No )

use the already prebuild Table component

we will get consumption data as:
[
    {
        "pC_ID": 182656,
        "pC_JobNo": null,
        "pC_Srno": null,
        "pC_PartCode": "SSNTVSVBFPCBAD006",
        "pC_PartDesc": "Main Board (E3A)",
        "pC_Date": "2024-10-11T17:25:28.41",
        "pC_Rate": 6500.00,
        "pC_Quantity": null,
        "pC_Amount": 6500.00,
        "pC_SendDef": null,
        "pC_DefPOID": null,
        "pC_Consumed": null,
        "ticket_no": "HRSL2409221018276",
        "scrapped": null,
        "defPartSerialNo": "",
        "packSlipNo": "JPS-2425-0025847",
        "isReturnable": false,
        "isReplaced": false,
        "isShort": null,
        "isFreshFaulty": true,
        "axStatus": 0,
        "inventoryType": "Paid"
    },
    {
        "pC_ID": 184159,
        "pC_JobNo": null,
        "pC_Srno": null,
        "pC_PartCode": "SSNTVSVBFPCBAD006",
        "pC_PartDesc": "Main Board (E3A)",
        "pC_Date": "2024-10-21T14:36:29.403",
        "pC_Rate": 6500.00,
        "pC_Quantity": null,
        "pC_Amount": 6500.00,
        "pC_SendDef": null,
        "pC_DefPOID": null,
        "pC_Consumed": null,
        "ticket_no": "HRSL2409221018276",
        "scrapped": null,
        "defPartSerialNo": "",
        "packSlipNo": "JPS-2425-0027448",
        "isReturnable": false,
        "isReplaced": false,
        "isShort": null,
        "isFreshFaulty": true,
        "axStatus": 0,
        "inventoryType": "Paid"
    }
]
*/
