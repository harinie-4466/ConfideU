# ConfideU Platform - Quick Start Guide

## 🚀 Getting Started

### Access the Platform

1. **Main Landing Page**: `/` - Overview and login options
2. **Security Demo**: `/security-demo` - Interactive security features
3. **Report Anonymously**: `/report` - Anonymous reporting form

---

## 👤 Login Roles

### 1. Citizen 🧑‍💼
```
URL: /login
Role: Citizen
Fields: Email, Password, Private Key
Action: Submit crime reports anonymously
```

### 2. In Organisation 🏢
```
URL: /login
Role: In Organisation
Fields: Organization Name, Password, Private Key
Action: Report on behalf of your organization
```

### 3. As Organisation (Police/NGO/Corporate/School) 🚔
```
URL: /login
Role: As Organisation
Fields: Organization Name, Type, Email, Password
Action: Investigate reports, manage cases
```

### 4. Admin 🔧
```
URL: /login
Role: Admin
Fields: Email, Password
Action: Manage organizations, view analytics
```

---

## 📊 Key Pages by Role

### For Citizens
| Page | URL | Purpose |
|------|-----|---------|
| Report Crime | `/report-crime` | Submit detailed report |
| Dashboard | `/dashboard/reporter` | Track reports, view updates |
| Anonymous Report | `/report` | Submit without login |

### For Organizations
| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/dashboard/organisation` | View assigned reports |
| See Reported Crimes | `/dashboard/organisation?tab=reported` | View submitted reports |
| Update Status | (In Dashboard) | Change case status |

### For Admin
| Page | URL | Purpose |
|------|-----|---------|
| Admin Dashboard | `/dashboard/admin` | View analytics & stats |
| Organizations | `/admin/organizations` | Manage organizations |
| Send Notifications | (In Dashboard tab) | Notify organizations |

---

## 🔐 Security Features

### 1. View Password Hashing Demo
```
1. Go to /security-demo
2. Click "Password Hashing" tab
3. Enter password
4. See PBKDF2-SHA512 hash generated
5. Understand 100,000 iterations + salt
```

### 2. View Evidence Verification
```
1. Go to /security-demo
2. Click "Evidence Verification" tab
3. See hash matching display
4. View digital signature verification
5. Understand AES-256-CBC encryption
```

### 3. View Data Hashing
```
1. Go to /security-demo
2. Click "Data Hashing" tab
3. Enter custom data
4. See SHA-256 hash generated
5. View HMAC signature created
```

---

## 📝 Quick Tasks

### Submit a Crime Report (Citizen)

```
1. Go to /login → Select "Citizen" → Register
   → Save your Private Key (you'll need it later!)
2. Go to /report-crime
3. Fill in details:
   - Crime Date & Venue
   - Person Committed (name & designation)
   - Incident Description
   - Category (Fraud, Corruption, etc.)
   - Confidentiality (High/Low)
   - Inform Police? (checkbox)
4. Click "Submit Report Securely"
5. Get your Case ID (track it!)
```

### View Organization Dashboard (As Police)

```
1. Go to /login → Select "As Organisation"
   → Police type → Register
2. Go to /dashboard/organisation
3. View tabs:
   - [All] - All reports
   - [Reported Crimes] - Only new submissions
   - [In Progress] - Cases being investigated
   - [Later] - Pending cases
   - [Solved] - Completed cases
4. Click on case to view details
5. Change status using dropdown
```

### Check Report Status (Citizen)

```
1. Go to /login → Select "Citizen" → Login
   → Enter private key
2. Go to /dashboard/reporter
3. Look for your Case ID
4. See current status
5. View timeline of changes
```

### View Evidence Verification

```
1. In organization dashboard
2. Click on report details
3. Scroll to "Evidence Files" section
4. See verification badges:
   ✓ Verified - Evidence is authentic
   ✗ Corrupted - Evidence was tampered with
5. Click to see hash details
```

---

## 🔄 Report Status Flow

```
Citizen/In-Org Submits Report
            ↓
Routes to Organization (Police/NGO/Corporate/School)
            ↓
Organization marks as "In Progress"
            ↓
Investigation continues
            ↓
Organization marks as "Solved" or "Later"
            ↓
Reporter sees update in dashboard
```

---

## 📱 Admin Analytics

### View Dashboard
```
1. Go to /dashboard/admin
2. See key metrics:
   - Total Reports
   - Resolved Cases
   - In Progress Cases
   - High Priority Reports
3. View charts:
   - Status Distribution (bar chart)
   - Reports by Category
4. See Recent Reports table
```

### Manage Organizations
```
1. Go to /admin/organizations
2. Browse vertical cards showing:
   - Organization name & type
   - Status (active/pending/inactive)
   - Contact info (email, phone, location)
3. Click Edit to modify
4. Click Delete to remove
```

---

## 🔑 Passwords & Authentication

### Password Hashing Process
```
User Password: "MySecurePassword123"
           ↓
         PBKDF2-SHA512 (100,000 iterations)
           ↓
      + Random Salt (16 bytes)
           ↓
    Hashed Password: "a1b2c3d4e5f6..."
```

### Login Verification
```
Entered Password: "MySecurePassword123"
           ↓
Hash with stored salt
           ↓
Compare hashes
           ↓
✓ Match = Login successful
✗ No match = Authentication failed
```

---

## 🚨 Important Notes

### Keep Your Private Key Safe!
- Generated on registration for Citizens/In-Org users
- Needed to login again
- **Never share with anyone**
- **Cannot be recovered if lost**

### Report Tracking
- Each report gets unique Case ID
- Use it to track progress
- Share with organization if needed
- **Do not share your Private Key**

### Confidentiality Levels
- **High**: Only Police see it
- **Low**: Police and NGO see it

### Inform Police Checkbox
- For In-Org reports only
- Sends report to Police department too
- Even if organization type is Corporate/School

---

## 🎓 Understanding Report Routing

### Citizen Reports
```
Low Confidentiality + No Police → Police Only
Low Confidentiality + (Inform Police not applicable) → Police + NGO
High Confidentiality → Police Only
```

### In-Organisation Reports
```
No Police Option → Same Organization Only
Police Option Checked → Same Org + Police
Police Option Unchecked → Same Org Only
```

---

## 📊 Understanding Organization Types

| Type | Receives | Can View |
|------|----------|----------|
| Police | Citizen reports (all), In-Org reports (if informed) | All police cases |
| NGO | Citizen reports (low confidentiality only) | NGO-specific cases |
| Corporate | In-org reports from same corporate | Corporate cases only |
| School | In-org reports from same school | School cases only |

---

## 🆘 Troubleshooting

### Lost Private Key?
```
❌ Cannot recover (security feature)
✅ Register new account and get new key
✅ Old reports still accessible through Case ID
```

### Forgot Password?
```
❌ No password recovery (anonymous platform)
✅ Register with different email
✅ Create new organization account
```

### Report Not Showing?
```
Check:
1. ✓ Correct tab selected (All/Reported/In Progress/etc)
2. ✓ Right organization type logged in
3. ✓ Confidentiality level matches
4. ✓ Inform Police option set correctly
5. ✓ Organization name matches report source
```

### Evidence Won't Verify?
```
Could be:
1. File corrupted during upload
2. Hash mismatch detected
3. Signature invalid
4. Evidence tampered with

Solution: Re-upload fresh evidence file
```

---

## 🔗 Useful Links

### Demo & Education
- [Security Features Demo](/security-demo)
- [How to Report Guide](/report-guide)
- [Privacy Policy](/privacy)
- [Terms of Service](/terms)

### Main Actions
- [Report Anonymously](/report)
- [Submit Crime Report](/report-crime)
- [Login](/login)
- [Main Dashboard](/dashboard/admin)

---

## ⏱️ Typical Workflows

### Workflow 1: Anonymous Citizen Report
```
Time | Action
-----|-------
5min | Go to /report
5min | Fill form with incident details
2min | Submit report
1min | Receive Case ID
0min | Done! Track via Case ID
```

### Workflow 2: Register & Report (Citizen)
```
Time | Action
-----|-------
5min | Go to /login → Register as Citizen
1min | Save Private Key (critical!)
5min | Go to /report-crime
5min | Fill detailed form with evidence
2min | Submit and get Case ID
0min | Done! Login anytime with Private Key
```

### Workflow 3: Organization Investigation
```
Time | Action
-----|-------
5min | Go to /login → Login as Organization
2min | View Reported Crimes tab
5min | Click report to view details
5min | Verify evidence integrity
5min | Update status to "In Progress"
0min | Citizen sees update immediately
```

---

## 🎯 Best Practices

### For Reporters
1. ✅ Use high confidentiality if concerned about identity
2. ✅ Provide detailed incident description
3. ✅ Include all relevant evidence
4. ✅ Save your Case ID and Private Key
5. ✅ Check dashboard regularly for updates

### For Organizations
1. ✅ Review reports promptly
2. ✅ Update status regularly
3. ✅ Verify evidence integrity before acting
4. ✅ Maintain confidentiality
5. ✅ Document all investigation steps

### For Admins
1. ✅ Monitor organization compliance
2. ✅ Send timely notifications
3. ✅ Review analytics regularly
4. ✅ Ensure all orgs updated
5. ✅ Audit access logs

---

## 📞 Support

### Getting Help
- **FAQ**: Available on `/report` page
- **Contact**: hello@confideu.com
- **Demo**: Visit `/security-demo` for feature walkthrough
- **Documentation**: See links above

### Report Issues
- Technical bugs → Contact support
- Security concerns → Email immediately
- Feature requests → hello@confideu.com

---

## 🏆 Quick Reference Summary

| Task | URL | Time |
|------|-----|------|
| Report anonymously | `/report` | 10min |
| Register & report | `/login` → `/report-crime` | 15min |
| View dashboard | `/dashboard/organisation` | 2min |
| Check analytics | `/dashboard/admin` | 5min |
| Learn security | `/security-demo` | 10min |
| Update case status | Dashboard → Dropdown | 1min |
| View evidence | Report details → Evidence section | 2min |

---

**Version**: 1.0.0  
**Updated**: February 2026  
**Status**: ✅ Ready to Use

Need more help? Visit [Security Demo](/security-demo) or contact support at hello@confideu.com
