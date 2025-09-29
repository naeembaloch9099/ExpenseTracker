import React from "react";
import styled from "styled-components";
import EmojiPicker from "emoji-picker-react";

/**
 * Simple icon picker modal UI. Parent should control visibility.
 * onSelect returns {name, icon, iconElement}
 */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

const Modal = styled.div`
  width: 520px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  @media (max-width: 700px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    padding: 0 0 32px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  z-index: 10;
  @media (max-width: 700px) {
    top: 18px;
    right: 18px;
    font-size: 2.4rem;
  }
`;

const IconPickerModal = ({ onClose, onSelect }) => {
  return (
    <Overlay>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseBtn aria-label="Close" onClick={onClose}>
          &times;
        </CloseBtn>
        <h3 style={{ margin: "24px 0 12px 0", textAlign: "center" }}>
          Pick Icon
        </h3>
        <div
          style={{
            marginBottom: 12,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              background: "#f3e8ff",
              color: "#7c3aed",
              borderRadius: 8,
              padding: "8px 12px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Emoji Picker
          </span>
        </div>
        <EmojiPicker
          width="100%"
          height={window.innerWidth < 700 ? 500 : 400}
          emojiStyle="native"
          onEmojiClick={(emojiData) => {
            onSelect &&
              onSelect({
                name: emojiData.emoji,
                icon: emojiData.emoji,
                iconElement: emojiData.emoji,
              });
            onClose && onClose();
          }}
          searchDisabled={false}
          skinTonesDisabled={false}
          previewConfig={{ showPreview: false }}
        />
      </Modal>
    </Overlay>
  );
};

export default IconPickerModal;
