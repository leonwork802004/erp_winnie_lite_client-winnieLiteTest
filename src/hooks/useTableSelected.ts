import { useCallback, useState } from "react";

export const useTableSelected = <T>() => {
  const [selected, setSelected] = useState<T | null>(null);

  const handleSelectedClick = useCallback((row: T | null) => {
    setSelected(row);
  }, []);

  return { selected, handleSelectedClick };
};
