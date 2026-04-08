import { Modal, ModalContent, ModalBody } from "@heroui/react";

const VideoModal = ({ isOpen, onOpenChange, videoUrl }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      hideCloseButton
      classNames={{ body: "p-0" }}
    >
      <ModalContent>
        <ModalBody>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={videoUrl}
              className="absolute inset-0 w-full h-full rounded-xl"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VideoModal;
