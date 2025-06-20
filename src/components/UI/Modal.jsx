import React from "react";
import ReactDOM from "react-dom";

const Backdrop = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-40 bg-white/30 backdrop-blur-sm"
      onClick={onClose}
    />
  );
};

const ModalOverlay = ({ children }) => {
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={stopPropagation}
    >
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6 relative">
        {children}
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = ({ onClose, children }) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
      {ReactDOM.createPortal(<ModalOverlay>{children}</ModalOverlay>, portalElement)}
    </>
  );
};

export default Modal;
