function isEmptyValue(value) {
  if (value === null || value === undefined) return true;

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
}

function focusField(field) {
  if (typeof document === "undefined") return;

  const targetId = field?.id || field?.name;
  if (!targetId) return;

  const element = document.getElementById(targetId);
  if (!element || typeof element.focus !== "function") return;

  element.focus();

  if (typeof element.scrollIntoView === "function") {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

export function validateRequiredFields(fields = [], options = {}) {
  const { focusFirstInvalid = true } = options;

  const missingFields = fields.filter((field) => isEmptyValue(field?.value));

  const errors = missingFields.reduce((acc, field) => {
    acc[field.key] = field.message || `${field.label} is required`;
    return acc;
  }, {});

  if (focusFirstInvalid && missingFields.length > 0) {
    focusField(missingFields[0]);
  }

  return {
    isValid: missingFields.length === 0,
    errors,
    missingFields,
    firstMissingField: missingFields[0] || null,
  };
}

export function clearFieldError(errors = {}, fieldKey) {
  if (!errors[fieldKey]) return errors;

  const nextErrors = { ...errors };
  delete nextErrors[fieldKey];
  return nextErrors;
}

export function buildRequiredFieldsMessage(missingFields = []) {
  if (missingFields.length === 0) return "Please fill all required fields";
  if (missingFields.length === 1) {
    return `${missingFields[0].label} is required`;
  }

  const labels = missingFields.map((field) => field.label);
  return `Please fill required fields: ${labels.join(", ")}`;
}
