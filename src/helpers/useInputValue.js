import { useState } from 'react';

export default function useInputValue(initialValue) {
  const [value, setValue] = useState(initialValue);

  return ({
    value,
    onChange: (e) => {
      setValue(e.target.value || e.target.innerText);
    },
  });
}
