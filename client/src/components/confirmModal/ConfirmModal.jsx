import "./confirmModal.css";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <p>{message}</p>
        <div className="modalButtons">
          <button onClick={onConfirm} className="confirmBtn">
            Yes
          </button>
          <button onClick={onCancel} className="cancelBtn">
            No
          </button>
        </div>
      </div>
    </div>
  );
}
