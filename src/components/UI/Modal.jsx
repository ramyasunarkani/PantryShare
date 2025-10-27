import React from "react";
import ReactDOM from "react-dom";

const Backdrop = ({ onClose }) => (
  <div
    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
    onClick={onClose}
  />
);

const ModalOverlay = ({  children, owner }) => {
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6 overflow-auto"
      onClick={stopPropagation}
    >
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {owner && (
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <img
              src={owner.photoURL || "/avatar.png"}
              alt={owner.fullName || "User"}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {owner.fullName || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500">Item Owner</p>
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = ({ onClose, children, owner }) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay onClose={onClose} owner={owner}>
          {children}
        </ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
