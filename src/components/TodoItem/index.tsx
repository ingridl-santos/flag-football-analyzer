/* eslint-disable @darwin/no-hard-coded-text */
import {
  Box, Button, Checkbox, Typography,
} from '@mui/material';

import { Task } from '../../redux/TodoSlice/types';

export interface TodoItemProps {
  task: Task;
  onChangeCheckmark: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TodoItem = ({ task, onChangeCheckmark, onDeleteTask }: TodoItemProps) => {
  const { title, done, id } = task;

  const onChangeValue = () => {
    onChangeCheckmark(id);
  };

  const onDelete = () => {
    onDeleteTask(id);
  };

  return (
    <Box className="todo-item">
      <Typography component="h3">{title}</Typography>

      <Box className="todo-checkbox-container">
        <Typography component="label">Status:</Typography>

        <Typography component="p" className={done ? 'done' : 'not-done'}>
          {done ? 'Done' : 'Not done'}
        </Typography>

        <Checkbox
          data-testid="CheckItemCheckbox-test-id"
          className="input-checkbox"
          name={`${title}-check`}
          checked={done}
          onChange={onChangeValue}
        />
      </Box>

      <Button
        data-testid="RemoveItemButton-test-id"
        className="delete-button"
        onClick={onDelete}
      >
        Remove
      </Button>
    </Box>
  );
};

export default TodoItem;
