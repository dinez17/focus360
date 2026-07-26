import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Delete', message }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
        <p className="text-dark-700 mb-6">{message || 'Are you sure? This action cannot be undone.'}</p>
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-light-400 text-dark-700">
                Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-danger text-white hover:bg-red-600">
                Delete
            </button>
        </div>
    </Modal>
);

export default ConfirmDialog;