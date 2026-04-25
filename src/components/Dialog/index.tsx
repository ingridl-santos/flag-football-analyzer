import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentProps,
  DialogActionsProps,
  SxProps,
  Box,
} from '@mui/material';
import { ReactNode, SyntheticEvent } from 'react';

export interface DialogProps extends Omit<MuiDialogProps, 'children' | 'title' | 'content' | 'actions' | 'onClose'> {
  title?: ReactNode;
  closeButtonTextLabel: string;
  content: ReactNode;
  actions?: ReactNode;
  slotProps?: {
    title?: { sx: SxProps };
    content?: Partial<Omit<DialogContentProps, 'children'>>;
    actions?: Partial<Omit<DialogActionsProps, 'children'>>;
  } & MuiDialogProps['slotProps'];
  onClose: (event: SyntheticEvent, reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick') => void;
}

export default function Dialog({
  title,
  closeButtonTextLabel,
  content,
  actions,
  slotProps: {
    title: titleSlotProps,
    content: contentSlotProps,
    actions: actionsSlotProps,
    ...restSlotProps
  } = {},
  onClose,
  ...rest
}: DialogProps) {
  return (
    <MuiDialog
      onClose={onClose}
      slotProps={restSlotProps}
      {...rest}
    >
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
        }}
      >
        <Box {...titleSlotProps}>
          {title}
        </Box>

        <IconButton
          aria-label={closeButtonTextLabel}
          sx={{
            marginLeft: 'auto',
          }}
          onClick={(e) => onClose(e, 'closeButtonClick')}
        >
          <ClearRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        {...contentSlotProps}
      >
        {content}
      </DialogContent>

      <DialogActions
        {...actionsSlotProps}
      >
        {actions}
      </DialogActions>
    </MuiDialog>
  );
}
