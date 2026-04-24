import { useState } from 'react';

import { TextField } from '@mui/material';

export interface InputFormProps {
  onAddNewTodo: (value: string) => void;
}

const InputForm = ({ onAddNewTodo }: InputFormProps) => {
  const [fieldInput, setFieldInput] = useState('');

  const onSubmit = () => {
    if (!fieldInput) return;
    onAddNewTodo(fieldInput);
    setFieldInput('');
  };

  return (
    <TextField
      className="field-container"
      id="textField"
      type="text"
      autoComplete="Add Todo Item"
      label="Add Todo Item"
      aria-label="Add Todo Item"
      variant="outlined"
      value={fieldInput}
      onKeyDown={(event) => event.key === 'Enter' && onSubmit()}
      required
      fullWidth
      onChange={(e) => setFieldInput(e.target.value)}
    />
  );
};

export default InputForm;
