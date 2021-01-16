import { useEffect, useRef } from "react";

function usePrevious<T extends {}>(value: T): T {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current as T;
}

export default usePrevious;
