export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const isOverdue = (deadline: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  return deadlineDate < today;
};

export const isUpcoming = (deadline: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);
  
  return deadlineDate >= today && deadlineDate <= twoDaysFromNow;
};

export const getDeadlineColor = (deadline: string): string => {
  if (isOverdue(deadline)) {
    return 'text-red-600 bg-red-50';
  }
  if (isUpcoming(deadline)) {
    return 'text-amber-600 bg-amber-50';
  }
  return 'text-emerald-600 bg-emerald-50';
};

export const getDeadlineStatus = (deadline: string): string => {
  if (isOverdue(deadline)) {
    return 'Overdue';
  }
  if (isUpcoming(deadline)) {
    return 'Upcoming';
  }
  return 'Future';
};