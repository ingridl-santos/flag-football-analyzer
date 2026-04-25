# State Management

## Overview

The application uses **Redux Toolkit v1** for client-side state management. The store is configured in `src/redux/store.ts` and uses typed hooks defined in `src/redux/hooks.ts`.

## Store Configuration

The store is in `src/redux/store.ts`:

- Configures the store with `configureStore` from Redux Toolkit
- The `reducer` object is extended as slices are added

```typescript
export const store = configureStore({
  reducer: {
    analysis: AnalysisSlice,
  },
});
```

## Typed Hooks

Always use the typed hooks from `src/redux/hooks.ts` instead of plain `useDispatch` and `useSelector`:

```typescript
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

// In your component:
const dispatch = useAppDispatch();
const analysisState = useAppSelector(SelectAnalysisState);
```

These hooks are pre-typed with `RootState` and `AppDispatch`, eliminating the need for manual type annotations.

## Creating a New Slice

The project has a pre-created `src/redux/AnalysisSlice/` folder ready to be populated. Follow this pattern:

### Step 1: Create the slice file

Create a folder `src/redux/MyNewSlice/index.ts`:

```typescript
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// 1. Define the state interface
export interface MyNewState {
  items: Array<string>;
}

// 2. Define the initial state
export const initialState: MyNewState = {
  items: [],
};

// 3. Create the slice
const myNewSlice = createSlice({
  name: 'myNew',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item !== action.payload);
    },
  },
});

// 4. Export actions
export const { addItem, removeItem } = myNewSlice.actions;

// 5. Export selector(s)
export const SelectMyNewState = (state: RootState) => state.myNew;

// 6. Export the reducer (default export)
export default myNewSlice.reducer;
```

### Step 2: Register in the store

In `src/redux/store.ts`, import and add the new reducer:

```typescript
import AnalysisSlice from './AnalysisSlice';

export const store = configureStore({
  reducer: {
    analysis: AnalysisSlice,
  },
});
```

## Using State in Components

```typescript
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addItem, SelectMyNewState } from '../../redux/MyNewSlice';

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(SelectMyNewState);

  const handleAdd = (item: string) => {
    dispatch(addItem(item));
  };

  return (
    <div>
      {items.map((item) => <span key={item}>{item}</span>)}
    </div>
  );
}
```

## Type Exports

The store exports these types (defined in `src/redux/store.ts`):

| Type | Purpose |
|---|---|
| `RootState` | Return type of `store.getState()` |
| `AppDispatch` | Type of `store.dispatch` |
| `AppThunk<ReturnType>` | Type for thunk actions |

## Conventions

- Slice folders use PascalCase: `AnalysisSlice/`, not `analysisSlice/`
- Selectors are prefixed with `Select`: `SelectAnalysisState`
- Initial state is exported (useful for testing): `export const initialState`
- The reducer is the default export; actions and selectors are named exports
- State mutations use Immer (built into Redux Toolkit) — write "mutative" code in reducers
