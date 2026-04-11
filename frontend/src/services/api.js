import axios from "axios";

const api = axios.create({
     baseURL : "http://localhost:3000/api"
});

// ranking APi 
export const fetchRankedCandidates =(params)=>{
    return api.get("/candidates/ranked",{params});
};

export const updateCandidateStatus =(id ,status)=>{
     return api.patch(`/candidates/${id.trim()}/status`,{status})
};



export default api;