import { render, screen } from '@testing-library/react';

import InputForm, { InputFormProps } from './index';

describe('Todo Item component', () => {
  const props: InputFormProps = {
    onAddNewTodo: vi.fn(),
  };

  it('should render without errors', () => {
    render(<InputForm {...props} />);
    const element = screen.getByLabelText('Add Todo Item');
    expect(element).toBeVisible();
  });
});
