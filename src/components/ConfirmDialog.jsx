import Modal from './Modal';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="muted text-sm">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
