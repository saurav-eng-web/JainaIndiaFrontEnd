in the ticket page,  we have to create a page, where will show the ticket history details by clicking on any line items of the ticket that we have, 
on the top we will show the selected ticket detail that we already have, that we are already showign in the tables
for the api that I provided we will show the data in tabular form

api details:
end point: Ticket/process
method: POST
payload: 
    {
  "type": "GetTicketDetail",
  "TicketNumber": "TKT-2026-000029"
}


expected response:
{
  "statusCode": 200,
  "statusMsg": "Ticket details fetched successfully.",
  "count": 6,
  "data": [
    {
      "Ticket_History_ID": 15, // dont show this
      "CreatedDateTime": "2026-06-30T17:59:13.707", // show this as date
      "Remarks": "Serial number not recognized by system for this model type.",
      "ActionByUserID": 51058, // 
      "ActionByUsername": "NSP", // as of now we are not getting this, but we will get this  in every line items, backend dev is working on that 
      "TransferredFromUserID": null, 
      "TransferredToUserID": null,
      "TransferredToUsername": null, // as of now we are not getting this, but we will get this  in every line items, backend dev is working on that , but we have  to use this
      "ResultingStatus": "OPENASSIGNED"
    },
    {
      "Ticket_History_ID": 16,
      "CreatedDateTime": "2026-06-30T18:21:05.45",
      "Remarks": "Escalated to Head Office queue for commercial workflow validation.",
      "ActionByUserID": 51058,
      "TransferredFromUserID": 51058,
      "TransferredToUserID": null,
      "ResultingStatus": "TRANSFERRED"
    },
    {
      "Ticket_History_ID": 17,
      "CreatedDateTime": "2026-07-01T10:25:39.537",
      "Remarks": "Escalated to Head Office queue for commercial workflow validation.",
      "ActionByUserID": 51058,
      "TransferredFromUserID": 51058,
      "TransferredToUserID": null,
      "ResultingStatus": "TRANSFERRED"
    },
    {
      "Ticket_History_ID": 21,
      "CreatedDateTime": "2026-07-01T11:39:26.45",
      "Remarks": "Escalated to Head Office queue for commercial workflow validation.",
      "ActionByUserID": 51058,
      "TransferredFromUserID": 51058,
      "TransferredToUserID": null,
      "ResultingStatus": "TRANSFERRED"
    },
    {
      "Ticket_History_ID": 26,
      "CreatedDateTime": "2026-07-01T12:27:18.257",
      "Remarks": "Escalated to Head Office queue for commercial workflow validation.",
      "ActionByUserID": 51058,
      "TransferredFromUserID": 51058,
      "TransferredToUserID": null,
      "ResultingStatus": "TRANSFERRED"
    },
    {
      "Ticket_History_ID": 30,
      "CreatedDateTime": "2026-07-01T14:25:28.747",
      "Remarks": "test7",
      "ActionByUserID": 48668,
      "TransferredFromUserID": 48668,
      "TransferredToUserID": 39,
      "ResultingStatus": "TRANSFERRED"
    }
  ]
}    