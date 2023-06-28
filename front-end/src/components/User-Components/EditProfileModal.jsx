import "../styles/User-Styles/EditProfileModal.css";

function EditProfileModal({ setIsEditModalOpen }) {
  return (
    <div className="edit-modal-container">
      <div className="edit-modal-content">
        <h1>Edit your profile information:</h1>
        <button
          className="edit-modal-close"
          onClick={() => setIsEditModalOpen(false)}
        >
          X
        </button>
      </div>
    </div>
  );
}

export default EditProfileModal;
