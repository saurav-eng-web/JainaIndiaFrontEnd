# Table

```js
const columnConfig = [
  { label: "Username", key: "Name", size: "sm" }, // Label is "Username", but look for "Name" in data
  { label: "Email", key: "Email", size: "xl" },
  { label: "Phone", key: "Phone", size: "md" },
  { label: "Category", key: "Test", size: "xs" },
  { label: "Status", key: "New", size: "sm" },
];

const rows = [
  {
    Name: "test1",
    Email: "test1@gmail.com",
    Phone: "1234",
    Test: "Admin",
    New: "Active",
  },
  {
    Name: "test2",
    Email: "test2@gmail.com",
    Phone: "5678",
    Test: "User",
    New: "Pending",
  },
];
```

# Modal

- we need open, and onclose
- rest everything as child

```javascript
<Modal open={allowancePopup} onClose={onCloseAllowanceModal} center>
  <SpeicalApprovalPopup ticketNo={activeTicket} />
</Modal>
```
