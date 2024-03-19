import { useState, useCallback } from "react";

// Change it to one modal and maybe remove
export const useModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);

  const openModal = useCallback((type: string) => {
    if (type === "result") setModalIsOpen(true);
    else setAboutModal(true);
  }, []);

  const closeModal = useCallback((type: string) => {
    if (type === "result") setModalIsOpen(false);
    else setAboutModal(false);
  }, []);

  return { modalIsOpen, aboutModal, openModal, closeModal };
};
