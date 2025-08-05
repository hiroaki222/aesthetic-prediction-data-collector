import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface FinishConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string | ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function FinishConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmButtonText,
  cancelButtonText
}: FinishConfirmationDialogProps) {
  const t = useTranslations('finish-confirmation-dialog');

  const defaultTitle = title || t('title');
  const defaultDescription = description || (
    <div className="space-y-2">
      <div>{t('description.line1')}</div>
      <div>{t('description.line2')}</div>
    </div>
  );
  const defaultConfirmButtonText = confirmButtonText || t('buttons.confirm');
  const defaultCancelButtonText = cancelButtonText || t('buttons.cancel');
  const handleConfirm = () => {
    onOpenChange(false);
    onConfirm();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultTitle}</DialogTitle>
          <div className="text-muted-foreground text-sm">
            {defaultDescription}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {defaultCancelButtonText}
          </Button>
          <Button onClick={handleConfirm}>
            {defaultConfirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
