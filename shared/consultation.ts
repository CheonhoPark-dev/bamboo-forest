export type ConsultationSubmission = {
  id: string;
  category: string;
  concern: string;
  phone: string;
  name: string;
  gender: string;
  birth: string;
  preferredDays: string[];
  preferredTimes: string[];
  privacyAgreed: boolean;
  submittedAt: string;
  savedAt: string;
  blobUrl?: string;
  pathname?: string;
};

export type ConsultationSubmissionInput = Omit<
  ConsultationSubmission,
  "id" | "savedAt" | "blobUrl" | "pathname"
>;
