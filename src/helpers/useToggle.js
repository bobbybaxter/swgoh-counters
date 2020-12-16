import { useState, useCallback } from 'react';

export default function useToggle(initial) {
  const [open, setOpen] = useState(initial);

  return [open, useCallback(() => setOpen(status => !status), [])];
}
