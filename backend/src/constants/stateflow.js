const stateflow = {
  APPLIED: ["SCREENED", "REVIEW"],
  SCREENED: ["INTERVIEW", "REJECTED"],
  REVIEW: ["SCREENED", "REJECTED"],
  INTERVIEW: ["HIRED", "REJECTED"],
  HIRED: [],
  REJECTED: []
};

export default stateflow;
