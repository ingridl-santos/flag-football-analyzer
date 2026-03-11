/* eslint-disable @darwin/no-hard-coded-text */
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import InputForm from '../../components/InputForm';
import TodoItem from '../../components/TodoItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  todoSelect,
  addTask,
  removeTask,
  updateTask,
} from '../../redux/TodoSlice';
import { ROUTES } from '../../router/routeDefinitions';
import { toNamedRoute } from '../../router/router';

import './TodoListPage.scss';

const TodoListPage = () => {
  const { todoList } = useAppSelector(todoSelect);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(toNamedRoute(ROUTES.home));
  };

  return (
    <Box className="todo-list">
      <Box className="container">
        <Button
          data-testid="GoToHomePageButton-test-id"
          variant="contained"
          onClick={handleNavigate}
          sx={{
            mb: 5,
          }}
        >
          Go to Home Page
        </Button>

        <Box className="todo-list-container">
          <InputForm onAddNewTodo={(value) => dispatch(addTask(value))} />

          {todoList.map((item) => (
            <TodoItem
              onChangeCheckmark={(id) => dispatch(updateTask(id))}
              onDeleteTask={(id) => dispatch(removeTask(id))}
              task={item}
              key={item.title}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TodoListPage;
