import { useEffect, useState } from 'react';
import { checkFirstLaunch } from '../utils/launch';

export function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const first = await checkFirstLaunch();
      setIsFirstLaunch(first);
    })();
  }, []);

  return isFirstLaunch;
}
