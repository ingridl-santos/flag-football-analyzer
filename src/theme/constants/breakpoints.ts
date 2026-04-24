import { Breakpoint } from '@mui/material';
import { createBreakpoints } from '@mui/system';

// Assures that breakpoints are always returned in expected order so we don't rely on MUI to be perfect
// Make sure to add any custom breakpoints to this array
export const breakpointsDescendingSize: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];

const breakpoints = createBreakpoints({});

export default breakpoints;
