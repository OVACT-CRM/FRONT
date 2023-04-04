import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ResetScroll() {
    
  const location = useLocation();

  useEffect(() => {
    // This function will be called whenever the route path changes
    window.scroll(0, 0);
    //console.log(location.pathname);
  }, [location]);

  return null;
}

export default ResetScroll