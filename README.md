# MediCrypt - Decentralized Medical Records Management

![Doctor Dashboard - MediCrypt](https://drive.google.com/uc?export=view&id=1nxDHQers2jU3A9tHtWRuOxx2WIgiy-Kw)



## 🌐 Vision

**MediCrypt** is a blockchain-powered application revolutionizing how medical records are stored, accessed, and shared. It uses:

- 🔐 **IPFS** for secure off-chain storage  
- 📜 **Ethereum smart contracts** for verifiable access control  
- 👛 **MetaMask** for decentralized user authentication  

Patients own their data, approve who accesses it, and benefit from transparency, decentralization, and security.

---

## ✅ Features Achieved

### 1. 🔑 MetaMask Integration for Authentication
- Login via Ethereum wallet signatures — no passwords.
- Secure key management using MetaMask.

### 2. ⚙️ Smart Contract Integration
- Smart contract deployed on Sepolia testnet.
- Patients upload records and manage access.
- Doctors can request access; patients approve/deny.

### 3. 🗃️ Medical Record Upload to IPFS
- Records uploaded via Pinata to IPFS.
- IPFS returns a CID (Content Identifier), stored on-chain.

### 4. 🔐 Access Control for Medical Records
- Role-based access control: Patients, Doctors, Researchers.
- Patients grant/deny access through smart contracts.

### 5. 🤖 AI Integration for Data Analysis (Planned)
- Analyze anonymized records for health trends and diagnoses.
- Future AI/ML models will offer research insights while preserving privacy.

### 6. ⛓️ Blockchain and CID Storage
- CIDs are stored on-chain; actual files remain on IPFS.
- Keeps gas fees low and ensures data immutability.

### 7. 🌐 API-Driven Backend
RESTful API for:
- Authentication (via MetaMask)
- Record CRUD operations
- Access management

### 8. 💻 Frontend Integration
React frontend with:
- MetaMask login/signup
- Dashboard for patients and doctors
- Record and access management

### 9. 🧑‍⚕️ Role-Based Access Control
- **Patients**: Upload & manage records  
- **Doctors**: Request & view upon approval  
- **Researchers**: Access anonymized data with consent  

---

## 👥 Who Will Benefit?

### 👨‍⚕️ Patients
- Own and manage their health data  
- Track who accesses their records  
- Decentralized & secure storage  

### 👩‍⚕️ Doctors
- Instant access to approved patient records  
- Eliminate reliance on paper records  

### 🔬 Researchers
- Access anonymized data for analysis  
- Future AI tools for insight extraction  

### 🏥 Healthcare Providers
- Seamless record sharing across stakeholders  

### 🧪 Third-Party Service Providers
- Permissioned access for data-driven innovation  

---

## 🔁 How It Works — Full Flow

### 1. 🧩 User Authentication
- Connect MetaMask → authenticate with Ethereum address  
- Generates JWT stored in localStorage  

### 2. 📤 Uploading Medical Records
- Patient uploads → record goes to IPFS (via Pinata)  
- Smart contract stores the CID  

### 3. 🔓 Access Requests
- Doctor sends access request via smart contract  
- Patient approves/denies request  

### 4. 🩺 Interacting with Medical Records
- Doctors & patients interact through dashboard  
- Researchers receive anonymized data only  

### 5. ☁️ Off-Chain Storage (IPFS)
- Data stored on IPFS  
- Only CID stored on Ethereum  

### 6. 👥 Role-Based Experience
| Role        | Actions                                    |
|-------------|--------------------------------------------|
| **Patient** | Upload/view/manage records                 |
| **Doctor**  | Request access & view with approval        |
| **Researcher** | Request anonymized data for research     |

---

## 🧰 Technologies Used

### Frontend
- **React** — UI
- **Axios** — API requests
- **Framer Motion** — Animations
- **MetaMask** — Wallet authentication
- **Vite** — Fast dev server

### Backend
- **Node.js + Express.js** — REST API
- **Prisma ORM** — PostgreSQL integration
- **Ethers.js** — Blockchain interaction
- **IPFS (via Pinata)** — Decentralized storage
- **JWT** — Auth

### Blockchain
- **Ethereum (Sepolia Testnet)**  
- **Solidity** for Smart Contracts

---

## ⚙️ Installation & Setup

### 📦 Prerequisites
- Node.js + npm  
- MetaMask extension

---

### 🛠️ Backend Setup

```bash
git clone <repo-url>
cd medicrypt-backend
npm install
```

Create a `.env` file and add:

```env
PORT=5002
DATABASE_URL="postgresql://user:password@localhost:5432/medicrypt"
JWT_SECRET="your-secret-key"
IPFS_PROJECT_ID="your-ipfs-project-id"
IPFS_PROJECT_SECRET="your-ipfs-project-secret"
CHAIN_RPC_URL="http://localhost:8545"
```

Run the backend:

```bash
npm run dev
```

---

### 💻 Frontend Setup

```bash
cd medicrypt-frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Future Improvements

- 🔔 Real-time notifications for access events  
- 🔐 End-to-end encryption for IPFS records  
- 🧠 AI-driven anonymized health insights  
- 👥 Enhanced roles for researchers  
- 🎨 Better UI/UX for healthcare professionals and patients  
