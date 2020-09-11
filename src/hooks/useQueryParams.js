import { useLocation } from 'react-router-dom';

export const useQueryParams = () => {
  const loc = useLocation();
  return new URLSearchParams(loc.search);
};

