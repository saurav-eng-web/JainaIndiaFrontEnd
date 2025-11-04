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
