export const CASE_STATUS = {
  FIR_FILED: "fir_filed",
  CHARGESHEET_FILED: "chargesheet_filed",
  COGNIZANCE_TAKEN: "cognizance_taken",
  UNDER_TRIAL: "under_trial",
  JUDGMENT_GIVEN: "judgment_given",
  APPEAL_PENDING: "appeal_pending",
  CLOSED: "closed",
} as const;

export type CaseStatus = typeof CASE_STATUS[keyof typeof CASE_STATUS];

export const PARTY_ROLE = {
  COMPLAINANT: "complainant",
  ACCUSED: "accused",
  VICTIM: "victim",
  WITNESS: "witness",
  UNKNOWN: "unknown",
} as const;

export type PartyRole = typeof PARTY_ROLE[keyof typeof PARTY_ROLE];

// Small helper arrays for selects
export const PARTY_ROLES_LIST: PartyRole[] = [
  PARTY_ROLE.ACCUSED,
  PARTY_ROLE.VICTIM,
  PARTY_ROLE.COMPLAINANT,
  PARTY_ROLE.WITNESS,
];

export default {
  CASE_STATUS,
  PARTY_ROLE,
  PARTY_ROLES_LIST,
};
