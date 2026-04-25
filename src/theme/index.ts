import { createTheme } from '@mui/material/styles';

import Button from './components/Button';
import ButtonBase from './components/ButtonBase';
import ButtonGroup from './components/ButtonGroup';
import Chip from './components/Chip';
import Container from './components/Container';
import CssBaseline from './components/CssBaseline';
import Dialog from './components/Dialog';
import DialogTitle from './components/DialogTitle';
import Paper from './components/Paper';
import Skeleton from './components/Skeleton';
import UseMediaQuery from './components/UseMediaQuery';
import breakpoints from './constants/breakpoints';
import palette from './constants/palette';
import typography from './constants/typography';

export const theme = createTheme({
  typography,
  breakpoints: {
    values: breakpoints.values,
  },
  palette,
  components: {
    MuiButton: Button,
    MuiButtonBase: ButtonBase,
    MuiButtonGroup: ButtonGroup,
    MuiChip: Chip,
    MuiContainer: Container,
    MuiCssBaseline: CssBaseline,
    MuiDialog: Dialog,
    MuiDialogTitle: DialogTitle,
    MuiPaper: Paper,
    MuiSkeleton: Skeleton,
    MuiUseMediaQuery: UseMediaQuery,
  },
});
