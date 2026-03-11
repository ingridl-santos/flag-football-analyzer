import { render, screen } from '@testing-library/react';

import TodoItem, { TodoItemProps } from './index';

describe('Todo Item component', () => {
  const props: TodoItemProps = {
    onChangeCheckmark: vi.fn(),
    onDeleteTask: vi.fn(),
    task: {
      id: '1',
      title: 'This is a title',
      done: true,
    },
  };

  it('should render without errors', () => {
    render(<TodoItem {...props} />);
    const element = screen.getByText('This is a title');
    expect(element).toBeVisible();
  });
});
