import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from './confirm-dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function openConfirmDeleteDialog(
  dialog: MatDialog,
  title: string,
  message: string
): Observable<boolean> {
  const dialogRef = dialog.open(ConfirmDialog, {
    data: { title, message },
  });
  return dialogRef.afterClosed().pipe(map(result => !!result));
}
