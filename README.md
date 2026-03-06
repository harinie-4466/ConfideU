# ConfideU - Secure Whistleblower Reporting Platform

## Project Overview

ConfideU is a comprehensive, secure anonymous reporting platform designed to protect whistleblowers while enabling organizations to investigate misconduct. The platform implements military-grade encryption, digital signatures, password hashing, and organization-based routing to ensure both anonymity and evidence integrity.

## Features Implemented

### 1. Enhanced Admin Dashboard
- **Multi-Chart Analytics**: Status distribution, category breakdown, recent reports
- **Key Metrics**: Total reports, resolved cases, in-progress cases, high priority
- **Responsive Grid**: Adapts to mobile, tablet, desktop screens
- **Data Visualization**: Bar graphs, pie charts, progress indicators

### 2. Full-Page Aligned Organization Dashboard
- **Notification Bell** (Top Right): With unread count badge
- **Full-Width Tabs**: Reported Crimes (submitted), In Progress, Later, Solved
- **Status Synchronization**: Changes in org dashboard reflect in reporter's dashboard
- **Real-Time Updates**: Shared context between dashboards

### 3. Vertical Card Layout for Organizations
- **Responsive Grid**: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- **Contact Information**: Email, phone, location with icons
- **Status Badges**: Active, pending, inactive indicators
- **Action Buttons**: Edit and delete functionality
- **Hover Effects**: Visual feedback on interaction

### 4. Enhanced Anonymous Reporting
- **Same Questions as Authenticated Users**: Complete feature parity
- **Integrated FAQ Section**: 4 common questions answered
- **Security Notice**: Prominent encryption guarantee
- **Tracking System**: Unique Case ID for follow-up

### 5. Organization-Based Crime Report Routing
```
Citizens → Police + NGO (if low confidentiality)
In-Organisation → Same Organisation + Police (if informed)
```
- **Visibility Control**: Reports only show to authorized organizations
- **Confidentiality Levels**: High/low impact routing decisions
- **Inform Police Option**: Direct police notification
- **Organization Type Filtering**: Police, NGO, Corporate, School

### 6. Cryptographic Security Features

#### Password Security (PBKDF2-SHA512)
- **100,000 Iterations**: Resistance to brute force
- **Random Salt**: 16 bytes per password
- **Unique Hashes**: Different hash each time
- **Verification Component**: Shows hash matching

#### Evidence Integrity (SHA-256 Hashing)
- **Content Hashing**: Detect file tampering
- **Hash Comparison**: Stored vs. computed
- **Corruption Detection**: Alert on mismatch
- **Verification Badge**: Clear integrity status

#### Digital Signatures (HMAC-SHA256)
- **Authenticity Proof**: Non-repudiation support
- **Signature Verification**: Matches expected value
- **Chain of Custody**: Audit trail maintained
- **Forensic Support**: Legal proceedings evidence

#### End-to-End Encryption (AES-256-CBC)
- **Random IV**: Unique per encryption
- **256-Bit Keys**: Military-grade security
- **Reversible**: Decryption supported
- **Evidence Protection**: Data confidentiality

#### RSA Implementation (Mock for Frontend)
- **Key Pair Generation**: Public/private keys
- **Encryption/Decryption**: Full cycle supported
- **Backend Ready**: Easy migration to real RSA

### 7. Evidence Verification Component
Displays comprehensive security information:
- File name with verification status
- Hash matching results
- Digital signature verification
- RSA encryption verification
- Corruption detection alerts
- "Verified" badge when all checks pass

### 8. Password Verification Display
Shows authentication details:
- PBKDF2-SHA512 algorithm info
- Entered password hash
- Stored password hash
- Verification status
- Security explanation

### 9. Status Synchronization
- **Real-Time Updates**: Organization status changes immediately visible to reporters
- **Timeline Entries**: Each change recorded with timestamp
- **Description Tracking**: Who changed status and when
- **Audit Trail**: Complete history maintained

### 10. Interactive Security Demo
- **Password Hashing Demo**: Test PBKDF2-SHA512 in real-time
- **Evidence Verification Demo**: See full verification flow
- **Data Hashing Demo**: SHA-256 and HMAC demonstration
- **Best Practices Guide**: Security recommendations

## Security Architecture

### Data Flow
```
Reporter Submit
    ↓
Generate Hash (SHA-256)
Generate Signature (HMAC-SHA256)
Encrypt Evidence (AES-256-CBC)
    ↓
Store with Verification Data
    ↓
Route to Authorized Organizations
    ↓
Organization Receives Report
    ↓
Verify Hashes
Verify Signatures
Decrypt Evidence
    ↓
Display with Security Status
```

### Authentication Flow
```
Registration:
  Password → PBKDF2-SHA512 + Random Salt → Store Hash + Salt
  
Login:
  Entered Password → PBKDF2-SHA512 + Stored Salt → Compare Hashes
  Match → ✓ Authenticated
```

## Quick Start

### For Developers

1. **View Security Demo**
   ```
   Navigate to /security-demo
   Explore all cryptographic features
   Test password hashing and evidence verification
   ```

2. **Check Admin Dashboard**
   ```
   Login as admin with any credentials
   View analytics and organization management
   See vertical card layout
   ```

3. **Test Report Submission**
   ```
   Login as citizen or organization
   Submit a crime report
   See routing to appropriate organization
   Track status updates
   ```

### For Users

1. **Submit Anonymous Report**
   - Go to `/report`
   - Fill in incident details
   - Choose confidentiality level
   - Get tracking ID

2. **Track Report Status**
   - Login with your credentials
   - View dashboard
   - See real-time updates
   - Access complete history

3. **Investigate Report**
   - Login as organization
   - View assigned reports
   - Verify evidence integrity
   - Update case status

## 📊 User Roles

| Role | Submits | Receives | Manages |
|------|---------|----------|---------|
| Citizen | Reports | Tracking updates | Nothing |
| In-Org | Org reports | Org routing | Nothing |
| As-Org | Nothing | Routed reports | Cases, Status |
| Admin | Nothing | System data | Organizations |

## Testing

### Password Hashing Test
```
1. Go to /security-demo
2. Enter: "MyPassword123"
3. See: PBKDF2-SHA512 hash generated
4. Verify: Salt is unique each time
```

### Evidence Verification Test
```
1. Go to /security-demo
2. View evidence with verification
3. See: Hash matching display
4. See: Signature verification
5. See: "Verified" badge
```

### Report Routing Test
```
1. Submit citizen report (low confidentiality)
2. Login as police - report appears
3. Login as NGO - report appears
4. Login as corporate - report doesn't appear
```

## Analytics

### Admin Dashboard Shows
- Total reports submitted
- Cases resolved (with %)
- Active investigations
- High priority cases
- Reports by category
- Organization performance

### Organization Dashboard Shows
- Assigned cases
- Status breakdown
- New submissions
- In-progress cases
- Solved cases
- Unread notifications

## Configuration

### Environment Variables
```
DATABASE_URL=           (for production)
JWT_SECRET=             (for production)
ENCRYPTION_KEY=         (for production)
RATE_LIMIT_WINDOW=      (for production)
```

### Local Development
```
No environment setup needed for demo
All features work with localStorage
Perfect for testing and learning
```
**Welcome to ConfideU - Secure Whistleblower Platform** 🔐
