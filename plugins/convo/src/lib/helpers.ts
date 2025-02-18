export const humanizeAgentName = (name: string) => {
  const words = name.split('-');
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
