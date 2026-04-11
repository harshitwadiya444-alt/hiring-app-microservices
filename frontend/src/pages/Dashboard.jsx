// import { useEffect, useState } from "react";
// import {
//   fetchRankedCandidates,
//   updateCandidateStatus
// } from "../services/api";
// import AuditModel from "./AuditModel";
// import axios from "axios";

// const allowedActions = {
//          APPLIED :["SCREENED"],
//          SCREENED:["INTERVIEW","REJECTED"],
//          REVIEW :["SCREENED","REJECTED"],
//          INTERVIEW:["HIRED","REJECTED"],
//          HIRED:[],
//          REJECTED:[]
// };

// const Dashboard = () => {
//   // data
//   const [candidates, setCandidates] = useState([]);

//   // pagination
//   const [page, setPage] = useState(1);
//   const limit = 5;

//   // filters (VIEW ONLY)
//   const [status, setStatus] = useState("");
//   const [minScore, setMinScore] = useState("");

//   // meta
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const [auditOpen , setAuditOpen] = useState(false);
//   const[auditLogs, setAuditLogs]  = useState([]);

//  const isActionAllowed = (currentStatus, action) => {
//   if (!currentStatus) return false;

//   const normalizedStatus = currentStatus.trim().toUpperCase();

//   return Boolean(
//     allowedActions[normalizedStatus]?.includes(action)
//   );
// };


//   // fetch data
//   const loadCandidates = async () => {
//     try {
//       setLoading(true);

//       const res = await fetchRankedCandidates({
//         page,
//         limit,
//         status,
//         minScore
//       });
//        console.log("API RESPONSE 👉", res.data);

//       setCandidates(res.data.ranked);
//       setTotalPages(res.data.meta.totalPages);
//     } catch (err) {
//       console.error("Error loading candidates", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCandidates();
//   }, [page]);

//   // manual decision (HUMAN)
//   const changeStatus = async (id, newStatus) => {
//     try {
//       await updateCandidateStatus(id, newStatus);
//       loadCandidates(); // refresh after update
//     } catch (err) {
//       alert("Invalid status transition");
//     }
//   };

//   const openAudit = async(candidate)=>{
//       const res  = await axios.get(`http://localhost:3000/api/candidates/${candidate.candidateId}/audit`);
//       setAuditLogs(res.data);
//       setAuditOpen(true);
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       console.log("CANDIDATES 👉", candidates);

//       <h2>Recruiter Dashboard</h2>

//       {/* 🔍 FILTERS */}
//       <div style={{ marginBottom: "15px" }}>
//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="APPLIED">APPLIED</option>
//           <option value="SCREENED">SCREENED</option>
//           <option value="INTERVIEW">INTERVIEW</option>
//           <option value="REJECTED">REJECTED</option>
//           <option value="HIRED">HIRED</option>
//         </select>

//         <input
//           type="number"
//           step="0.1"
//           placeholder="Min Score (view filter)"
//           value={minScore}
//           onChange={(e) => setMinScore(e.target.value)}
//           style={{ marginLeft: "10px" }}
//         />

//         <button
//           onClick={() => {
//             setPage(1);
//             loadCandidates();
//           }}
//           style={{ marginLeft: "10px" }}
//         >
//           Apply
//         </button>
//       </div>

//       {/* 📊 TABLE */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table border="1" cellPadding="10">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Score</th>
//               <th>Status</th>
//               <th>Actions (Manual)</th>
//             </tr>
//           </thead>

//           <tbody>
//             {candidates.length === 0 ? (
//               <tr>
//                 <td colSpan="4">No candidates found</td>
//               </tr>
//             ) : (
//               candidates.map((c) => (
//                 <tr key={c._Id}>
//                   <td>{c.name}</td>
//                   <td>{c.score}</td>
//                   <td>{c.status}</td>
//                   <td>
//                     <button
//                        disabled={!isActionAllowed(c.status,"INTERVIEW")}
//                       onClick={() =>
//                         changeStatus(c.candidateId, "INTERVIEW")
//                       }
//                     >
//                       Interview
//                     </button>{" "}
//                     <button
//                       disabled={!isActionAllowed(c.status,"REJECTED")}
//                       onClick={() =>
//                         changeStatus(c.candidateId, "REJECTED")
//                       }
//                     >
//                       Reject
//                     </button>{" "}
//                     <button
//                      disabled={!isActionAllowed(c.status,"HIRED")}
//                       onClick={() =>
//                         changeStatus(c.candidateId, "HIRED")
//                       }
//                     >
//                       Hire
//                     </button>
//                     <button onClick={()=>openAudit(c)}>
//                       View History
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       )}

//       {/* ⏭ PAGINATION */}
//       <div style={{ marginTop: "15px" }}>
//         <button
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//         >
//           Prev
//         </button>

//         <span style={{ margin: "0 10px" }}>
//           Page {page} of {totalPages}
//         </span>

//         <button
//           disabled={page === totalPages}
//           onClick={() => setPage(page + 1)}
//         >
//           Next
//         </button>
//       </div>

//       <div>
//         <AuditModel 
//         open ={auditOpen}
//         logs= {auditLogs}
//         onClose={()=>setAuditOpen(false)}
//        />
//       </div>
      
//     </div>
    
//   );
// };

// export default Dashboard;
