import { Modal, ModalContent, ModalBody } from "@heroui/react";

const isDirectVideoUrl = (url) => {
  if (!url) return false;
  try {
    const path = new URL(url).pathname.toLowerCase();
    return /\.(mp4|webm|ogg|mov|mkv|avi)(\?|$)/.test(path);
  } catch {
    return /\.(mp4|webm|ogg|mov|mkv|avi)(\?|$)/.test(url.toLowerCase());
  }
};

const VideoModal = ({ isOpen, onOpenChange, videoUrl }) => {
  const isDirect = isDirectVideoUrl(videoUrl);

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
            {isDirect ? (
              <video
                src={videoUrl}
                className="absolute inset-0 w-full h-full rounded-xl"
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <iframe
                src={videoUrl}
                className="absolute inset-0 w-full h-full rounded-xl"
                allow="autoplay; fullscreen"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
              />
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VideoModal;
