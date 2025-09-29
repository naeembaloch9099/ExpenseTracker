import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
`;
const Modal = styled.div`
  background: #fff;
  padding: 18px;
  border-radius: 12px;
  width: 380px;
`;
const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

const DeleteModal = ({
  title = "Delete",
  message = "Are you sure?",
  onCancel,
  onConfirm,
}) => {
  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <Buttons>
          <button onClick={onCancel} style={{ padding: "8px 12px" }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 12px",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 6,
            }}
          >
            Delete
          </button>
        </Buttons>
      </Modal>
    </Overlay>
  );
};

export default DeleteModal;
