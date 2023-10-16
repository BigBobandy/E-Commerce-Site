import "../../styles/Modal-Styles/GuestModal.css";

function GuestModal({ setIsGuestModalOpen }) {
  return (
    <div className="modal-container">
      <div className="guest-modal-container">
        <div className="modal-header-container">
          <h1>Guest Checkout Unavailable</h1>
          <button
            className="modal-close"
            onClick={() => setIsGuestModalOpen(false)}
          >
            Close X
          </button>
        </div>
        <div className="guest-modal-content">
          <p>The guest checkout feature is currently under construction.</p>
          <p>
            To experience the full functionality of this application, I
            encourage you to create an account by signing in or signing up.
          </p>
          <p>
            Your support helps showcase the hard work that has gone into
            building this project. Thank you for your understanding.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GuestModal;
