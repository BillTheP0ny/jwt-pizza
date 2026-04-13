CS 329 Deliverable #12: Penetration Testing
Assigned Peers: Jordan Parr and Bentley Bigelow
04/11/26
Jordan's Self-Inflicted Penetration Tests:

1. Login enumeration probe
Item	Result
Date	April 13, 2026
Target	pizza.pizzafrodobaggins.click
Classification	Identification and Authentication Failures
Severity	0
Description	Used Burp Suite Intruder to test multiple email values against the authentication endpoint using the same incorrect password. Tested values included valid-format and fake accounts. All requests returned HTTP 404 with identical response lengths and similar timings, indicating no obvious user enumeration through these response differences during this test. 
Images	
Corrections	None required based on this test. Continue using consistent responses for authentication failures and consider rate limiting for repeated login attempts.
---
2. Input validation / injection probe
Item	Result
Date	April 13, 2026
Target	pizza.pizzafrodobaggins.click
Classification	Injection
Severity	0
Description	Used Burp Suite Intruder to send malformed and suspicious values in the email field of the authentication request, including invalid formats, oversized input, script tags, and SQL-style strings. All requests returned HTTP 404 with identical response lengths and no visible errors, indicating the application handled these probes consistently during testing. 
Images	
Corrections	None required based on this test. Continue validating inputs server-side and returning generic error responses.
---
3. Password mutation probe
Item	Result
Date	April 13, 2026
Target	pizza.pizzafrodobaggins.click
Classification	Input Validation
Severity	0
Description	Used Burp Suite Intruder to modify the password field with unexpected values including empty input, null, objects, arrays, numeric values, oversized strings, script payloads, and SQL-style strings. The valid baseline request returned HTTP 200, while malformed variants consistently returned HTTP 404 with uniform response sizes, indicating unexpected password inputs were rejected during testing.
Images	
Corrections	None required based on this test. Continue strict server-side validation and consistent error handling.
---
4. Unauthorized access probe
Item	Result
Date	April 13, 2026
Target	pizza.pizzafrodobaggins.click
Classification	Broken Access Control
Severity	0
Description	Used Burp Suite Intruder to request a protected API endpoint without valid authentication. All requests returned HTTP 401 with identical response lengths, indicating unauthorized access was blocked during testing.

Images	
Corrections	None required based on this test. Continue enforcing authentication checks on protected routes.
---
5. Error handling and malformed authentication payload probe
Item	Result
Date	April 13, 2026
Target	pizza.pizzafrodobaggins.click 
Classification	Security Misconfiguration 
Severity	0
Description	Used Burp Suite Intruder to submit malformed values in the authentication request, including broken characters, partial JSON fragments, null values, script payloads, and oversized strings. The valid baseline request returned HTTP 200, while malformed values consistently returned HTTP 404 with uniform response lengths. No stack traces, internal paths, or sensitive debug details were exposed during testing.
Images	
Corrections	None required based on this test. Continue returning generic errors and suppressing internal exception details.
---



Bentley's Self-Inflicted Penetration Tests:
1. Login brute force / auth stress
Item	Result
Date	April 11, 2026
Target	https://pizza-service.bentleybigelow.click
Classification	Identification and Authentication Failures
Severity	1
Description	Repeated wrong-password logins were used to identify auth behavior and account discovery by using a real email and a fake email. With a real user email and wrong password, responses were `403` at steady, consistent intervals. With a non-existent email and wrong password, responses were `404` at the same steady pattern. Different status codes allow an attacker to tell registered emails from fake ones.
Images	![Brute force account detection](/public/BigelowSelfAttack1.png)
Corrections	Return a single generic outcome of `403` with an “incorrect credentials” message whether the email exists or not so attackers can't differentiate between real and nonexistent accounts. I will also add rate limiting by IP (for this project as an in-memory data structure, but prod-level would be an Upstash Redis instance) so brute-force attempts cannot continue unbounded.
---
2. Injection probes on list `name` query parameters
Item	Result
Date	April 11, 2026
Target	https://pizza-service.bentleybigelow.click
Classification	Injection
Severity	0
Description	Crafted SQL-style strings were sent in the `name` parameter on `GET /api/user` with unique characters and boolean fragments to see if the input is concatenated into queries or commands, causing errors, extra rows, etc., both without an auth token and with. Every attempt returned only `{"message":"unauthorized"}` with no database errors or unexpected rows.
Images	![Injection probe results](/public/BigelowSelfAttack2.png)
Corrections	None needed, inputs are parameterized before use!
---
3. Broken access control (admin lists and cross-user delete)
Item	Result
Date	April 11, 2026
Target	https://pizza-service.bentleybigelow.click
Classification	Broken Access Control
Severity	0
Description	Tried to see if a non-admin user could perform admin-related actions. `GET /api/user?page=0&limit=10&name=*` with no `Authorization` header returned `401` with `{"message":"unauthorized"}`. The same listing request with a valid auth token returned `403` and the same JSON body. `DELETE /api/user/4` with that auth token also returned `403` and `{"message":"unauthorized"}`. No admin listing or cross-user delete went through.
Images	![Broken access control probe](/public/BigelowSelfAttack3.png)
Corrections	None needed, non-admins are prevented from performing admin functions!
---
4. JWT tampering / privilege probe
Item	Result
Date	April 11, 2026
Target	https://pizza-service.bentleybigelow.click
Classification	Cryptographic Failures

Severity	0
Description	Decoded a diner/non-admin JWT, changed `roles` in the payload to `[{"role":"admin"}]`, re-encoded the header and payload, and reused the original signature so the MAC no longer matches the modified body (a forged token). Sent it as `Authorization: Bearer` on `GET /api/user?page=0&limit=10&name=*` and `DELETE /api/user/4`. The APIs returned `401` with `{"message":"unauthorized"}`showing the server did not trust the elevated `roles` claim, validated in the admin dashboard. The attack failed to turn a non-admin JWT into an admin-capable session.
Images	![JWT tampering probe](/public/BigelowSelfAttack4.png)
Corrections	None needed, tampered tokens are rejected and privileges cannot be escalated by editing the payload alone.
---
5. Diner deletes a franchise
Item	Result
Date	April 11, 2026
Target	https://pizza-service.bentleybigelow.click
Classification	Broken Access Control
Severity	3
Description	Diner/non-admin/non-franchisee was still able to delete any franchise by id (either found in a network response or guessed). Using the diner's auth token and calling `DELETE $BASE/api/franchise/<targetId>`, the service answered `200` with `{"message":"franchise deleted"}`, so the franchise (and related stores/roles per the app’s cascade logic) actually went away, representing a loss of data in the available locations, revenue, etc.
Images	![Diner franchise delete](/public/BigelowSelfAttack5.png)
Corrections	Right before `deleteFranchise` hits the database, enforce the same checks as other sensitive routes: require `Role.Admin` or require that the authenticated user’s id shows up in that franchise’s admins list (franchise owner path).
---

Jordan's Penetration Tests on Bentley's JWT Pizza:
1. Login enumeration probe
Item	Result
Date	April 13, 2026
Target	pizza.bentleybigelow.click
Classification	Identification and Authentication Failures
Severity	0
Description	Used Burp Suite Intruder to test multiple account values against the authentication endpoint using the same incorrect password. All tested values returned HTTP 403 with identical response lengths and similar response times, indicating no obvious user enumeration through response differences during testing.
Images	
Corrections	None required based on this test. Continue using consistent authentication failure responses and consider rate limiting repeated login attempts.
---
2. Input validation and injection probe on login email field
Item	Result
Date	April 13, 2026
Target	pizza.bentleybigelow.click
Classification	Injection
Severity	0
Description	Used Burp Suite Intruder to submit malformed and suspicious values in the email field of the authentication request, including invalid formats, script-style input, SQL-style strings, and oversized values. All requests returned HTTP 403 with identical response lengths and no visible errors, indicating the application handled these probes consistently during testing.

Images	
Corrections	 None required based on this test. Continue validating inputs server-side and returning generic authentication errors.
---
3. Password Mutation
Item	Result
Date	April 13, 2026
Target	pizza.bentleybigelow.click
Classification	Input Validation
Severity	0
Description	Used Burp Suite Intruder to modify the password field with unexpected values including empty input, null, objects, arrays, numeric values, script-style input, oversized strings, and SQL-style strings. The valid baseline credential returned HTTP 200, while malformed values consistently returned HTTP 403 with uniform response sizes, indicating unexpected password inputs were rejected during testing.

Images	
Corrections	None required based on this test. Continue strict validation and generic authentication responses.
---
4. Unauthorized Access Probe
Item	Result
Date	April 13, 2026
Target	pizza.bentleybigelow.click 
Classification	Broken Access Control
Severity	0
Description	Used Burp Suite Intruder to request a protected API endpoint without valid authentication. All requests returned HTTP 401 with identical response lengths, indicating unauthorized access was blocked during testing.

Images	
Corrections	None required based on this test. Continue enforcing authentication checks on protected routes.
---
5. Error Handling Probe
Item	Result
Date	April 13, 2026
Target	https://pizza-service.bentleybigelow.click
Classification	Security Misconfiguration
Severity	0
Description	Used Burp Suite Intruder to submit malformed values in the authentication request, including broken characters, partial JSON fragments, null values, and script-style input. The valid baseline request returned HTTP 200, while malformed values consistently returned HTTP 403 with uniform response sizes. No stack traces, internal paths, or sensitive debug details were exposed during testing.
Images	![Diner franchise delete](/public/BigelowSelfAttack5.png)
Corrections	None required based on this test. Continue returning generic errors and suppressing internal exception details.


Bentley's Penetration Tests on Jordan's JWT Pizza:

Summary of Learnings:
