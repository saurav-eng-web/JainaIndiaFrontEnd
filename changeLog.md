# Change Logs FE

## 1.2

- `bug` → while registering for call, phone and alternate phone number were same✅
  - currently the wkph & hfixed
- `bug` → warranty registration page submitting even without valid serial number ✅
  - earlier, if the serial number is invalid then there was a option to fill the details manually. Currently it will not allow to fill the details, so without a valid serial number users can’t register warranty.
- `bug` → not redirecting to login page when token has expired✅
  - `issue` → there were some issue in axiosInstance, and server
- `bug` → login issue when signing in with ASM and RSM roles
  - `prob` → there were routing issues
  - `sol` → fixed routing issue if logged in with ASM/RSM roles
- `bug` → warranty registration file upload not working properly ✅
  - `issue` →we were getting network error, because the combination of .net as server + gzip + blob, this was creating issue to download file, this cannot be downloaded through client side
  - `sol` → we implement a server in next js itself, where it gets the file and then stream to client
- ## `bug` → prevent warranty registration if serial number is invalid ✅
- `UI fix` → opening sidebar caused page shrinking, adjusted layout ✅
- `UI fix` → warranty registration input field styling updated ✅
- `UI fix` → change color if warranty already exists ✅

---

## 1.3.1

- `UI fix` → change email to caller number in history page
- `UI Fix` → fav icon for jaina and sansui world
- `feat` → sansui world service registration page
- `feat` → for sansui web url, users won’t be able to register for call if the serial number is invalid, and won’t be able to enter the product details manually
- `bug` → removed button to register for another call for sansui
- `fix` → submit call payload changed from username to `firstName-web`
- `feat` → sms implementation on call register for cc and sansui

---

## 1.4

- `change` → created a next api to send sms
  - earlier we used the main server to send sms, currently hand

## v 1.5.0 | 01-11-25

### bug fixes

- send otp was not working in sansui web call registration ✅
  - the issue was earlier the otp api did not require the token, later on it required
- otp verified not showing after successful verification ✅
  - now showing

## v1.6.0 | 04-11-25

### feat

- bulk uploader

### fixes

- web call register payload, Enterby: web ✅
- sms not sent on successfull call creation through web ✅
- add validation in bulk call creation ✅
- caller number in history -> customer details
- nsp and sf were same, fixed, nsp to branchName
- complaint date overflow
- removed pending Pending Level

## v1.7.0 | 06-11-25

### feat

- call cancellation request
- action buttons on history
- edit customer details on history page
- allow bulk upload only for speicied user

## v1.7.1 | 06-11-25

### fixes

- fixed reports download stream error
- fixed consumption tab, history page

### etc

- feat: image upload

## v1.7.2

- created Print page UI with integration
- created challan page UI with integration
- created separate print for nsp and asp
- add actions on history page with api integration
- created popus for re-alott
- created popup for cancellation with api integration
- created popup for WIP

## v1.7.3

- get engineer api, on select menu
- asc code added on table in history page
- calendar bug fixed on re allot page - ASM (allowed only future dates)
- re allot approve fixed

## v1.7.4

- fix deps, missing key in options - Allotment page

## v1.7.5

### fixes

- allotment page: date, and time fix (now the date is only allowed for next 72 hours, time 8 am - 9m. for today, only time allowed min after one hour)
- improved eslint, prettier for dev.
- re allot: change the api - level1 -> update job -> complaint history -> call schedule
- download report fix: name issue, handling errors
- improve history page, efficient use of useEffect for loading data

## feat

- WIP
- get engineer api, action -> Assigned
- added logger api, utility to log on loki

## v1.8

- code clean, removed clutter
- po receive
- claim approve
- claim approve cust details

- improve Dockerfile, add .dockerignore
- fix: next js issue

## 1.8.2

- Dockerfile fix -> secured it further
- fix: claim-approve
- integration: claim-approve/details
- secured document upload and fetch
- fix claim-approve/details
- fix authSlice
- fix Dockerfile
- fix ASM cancellation request
- feat: RSM cancellation request

## 2.0.0

- send happy code
- fix: handle asm cancellation request routing, disabled button if the user clicks on action buttons to avoid repeated actions
- fix: search page, where no result found. improved UX
- fix: update history after cancellation request approved/reject
- feat: loader on dashboard screen, UI fix: card size fixed
- fix: history page: Appointment time, date, promise date
- fix: fetch visit details and improved api call on loading history page
- feat: visit details table
- feat: dashboard bucket render order based on the cnt, coming from DashboardBucket/role

## 2.1.0

- feat: create challan page
- feat: fix pagination, when we have data less than the default list size, not rendering the pagination menu
- fix: route to dashboard after login, changed to search

## 2.1.1

- feat: search on tables, where pagination was implemented
- fix: current page size by default is 15, on history page, it is 25
- fix: change the options for item per page to 15,50,100
- feat: generic components, button, input fields
- feat: special approval NSP
- feat: special approval RSM
- fix: improve redux
- fix: sidebar reload when clicked on same page
- fix: history page, special approval was showing from anywhere, now restricted
- feat: confirmation modal

## 2.2.0

- fix: dashboard card spacing
- fix: dashboard action master call only on sf/ssf role
- UI fix: sidebar: remove vanilla css, improved animation, fix broke UI for user section,
- fix: many components where they were using vanilla css.
- fix: Table components now have option to set the column size as well
- fix: use the Table component across multiple components
- getting loki project name through .env
- fix: load action master only on sf

## 2.2.1

- fix: create challan page, causing error while building
- improved docker image
- fix sidebar icon not rendering after build
- fix: import fa icons and font

## 2.2.2

- fix: call page -> migrate from css to tailwind
- fix: sidebar hovering issue, it gets expanded even without getting onto it, it gets hover when the cursor is near to that
- fix: re-allot asm reject request, removed validation, added the asm remark to customer remark
- fix: RSM allowance approve request update with pincode, sc pincode and distance, fix the list
- fix: remove unneccessary console logs

# 2.2.3

- feat: page skeleton add,
- fix: multiple pages UI
- fix: warranty registration page fix
- fix: multiple pages UI
- add part pending converted to popup
- feat: integrate api part pending

# 2.2.3

- feat: page skeleton add,
- fix: multiple pages UI
- fix: warranty registration page fix
- fix: multiple pages UI
- add part pending converted to popup
- feat: integrate api part pending

# 2.3.0

- fix: revamp history page, highly improve the performance of histrory
  - separted multiple components for better perfomance
  - separated multiple api calls
  - implement caching of api, so that the api did not hit again and again on tab change
- fix, feat: part pending, multiple fixes, UI enhancements
- update: payload: part pending,
- UI fix: create challan: update table to maintain consistent UI
- fix: create challan: sorted the data by ageing
- feat: PO request
- fix: image upload
- fix: flow of submission, based on the message that we get
- feat: integrate PO request
- feat: integrate PO receive
- feat: PO recieve

# 2.3.1

- fix: part consumption, it was not rendering earlier, just showing the json direclyt
- feat: menu for dispatch (sf/ssd)
- fix: history-> documents tab: change to URL to fetch the document directly

# 2.3.2

- fix: ip not fetching
- feat: health check

# 2.3.3

- fix: knowledge portal: refactored code, improve page performance
- feat: DOA receive
- feat: part consume, UI
- fix: doa receive, routing
- fix: asm reallot, re allot reject fix
- update: node version in docker imag

# 2.3.4

- feat: MSL part consume
- feat: bind MSL part consume with dashboard bucket
- feat: DOA Closure
- feat: bind DOA closure to action button
- fix: DOA closure payload
- feat: Image pendign for HVP
- fix: Image upload
- fix: image upload route
- feat: reallot, assign
- change: add photos upload in WIP
- feat: gas charging approval
- fix: image preview
- fix: video uploads
- fix: update next js to version 15.3.8, suggested by next js itself in npm audit
- fix: consume part, remove tabs
- feat: ok call
- feat: sca
- feat: sca history on history page
- fix: load sca data
- feat: cost estimate
