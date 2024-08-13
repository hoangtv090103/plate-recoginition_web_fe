import React, { useRef, useEffect } from 'react';

interface CameraComponentProps {
  onCapture: (blob: Blob) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
          video.play();
        })
        .catch(err => {
          console.error("Lỗi khi truy cập camera: ", err);
        });

      return () => {
        // Dừng camera khi component bị unmount
        if (video.srcObject) {
          (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
      };
    }
  }, []);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            onCapture(blob);
          }
        }, 'image/png');
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }} />
      <button onClick={handleCapture}>Chụp ảnh</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraComponent;
