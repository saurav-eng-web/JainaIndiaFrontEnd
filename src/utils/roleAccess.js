// const DEFAULT_ALLOWED_ROLES = ["cc"];
const DEFAULT_ALLOWED_ROLES = ["sf/ssd"]; // ASC
// const DEFAULT_ALLOWED_ROLES = ["zone", "asm", "br"]; // NRA
// const DEFAULT_ALLOWED_ROLES = ["financeexec", "zone", "sf/ssd", "asm", "br", "finance"]; // TESTING

export function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toLowerCase();
}

export function getDeploymentAllowedRoles() {
  const envRoles = process.env.NEXT_PUBLIC_ALLOWED_ROLES;

  if (!envRoles) {
    return DEFAULT_ALLOWED_ROLES;
  }

  return envRoles
    .split(",")
    .map((role) => normalizeRole(role))
    .filter(Boolean);
}

export function isRoleAllowedForDeployment(role) {
  const normalizedRole = normalizeRole(role);
  const allowedRoles = getDeploymentAllowedRoles();
  return allowedRoles.length === 0 || allowedRoles.includes(normalizedRole);
}
