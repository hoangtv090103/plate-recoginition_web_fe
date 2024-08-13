import React, { useState } from "react";
import CameraComponent from "./components/CameraComponent";
import axios from "axios";

interface Result {
  results: string;
  tinh_tp: string;
  quan_huyen: string;
}

const App: React.FC = () => {
  const [result, setResult] = useState<Result | null>(null);

  const handleCapture = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob, "screenshot.png");

    try {
      const response = await axios.post("/api/v1/upload/", {
        method: "POST",
        body: formData,
      });
      const data: Result = await response.data;
      console.log(data);
      
      setResult(data);
    } catch (error) {
      console.error("Lỗi khi gửi ảnh:", error);
    }
  };

  return (
    <div>
      <h1>Quét biển số xe</h1>
      <CameraComponent onCapture={handleCapture} />
      {result && (
        <div>
          <h2>Kết quả:</h2>
          <p>Biển số xe: {result.results}</p>
          <p>Tỉnh/TP: {result.tinh_tp}</p>
          <p>Quận/Huyện: {result.quan_huyen}</p>
        </div>
      )}
    </div>
  );
};

export default App;
