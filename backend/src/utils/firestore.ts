
/**
 * Helper to convert Firestore Timestamp to Date
 */
export const convertTimestamp = (timestamp: any): Date | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp._seconds) {
    return new Date(timestamp._seconds * 1000);
  }
  return undefined;
};

/**
 * Helper to convert Firestore document data with timestamps
 */
export const convertDocumentDates = (data: any): any => {
  if (!data) return data;
  
  const converted = { ...data };
  
  // Convert common date fields
  const dateFields = ['createdAt', 'updatedAt', 'lastActivityAt', 'reviewedAt', 'startedAt', 'completedAt', 'lastAccessedAt', 'connectedAt', 'adminExitsAt', 'currentPeriodEnd', 'subscriptionEndDate'];
  
  dateFields.forEach(field => {
    if (converted[field]) {
      converted[field] = convertTimestamp(converted[field]);
    }
  });
  
  return converted;
};

