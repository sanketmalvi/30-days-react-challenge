
import { useState, useRef } from "react";
import axios from "axios";

export default function UploadEase() {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState("");
  const [gallery, setGallery] = useState([]);
  const [modalFile, setModalFile] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE_MB = 10;

  const handleFiles = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);

    if (validFiles.length !== selectedFiles.length) {
      alert("Some files exceed the size limit of 10MB.");
    }

    const fileObjs = validFiles.map(file => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      uploadedAt: new Date().toLocaleString()
    }));
    setFiles(fileObjs);
    setUploadProgress({});
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploadStatus("Uploading...");

    for (const fileObj of files) {
      const formData = new FormData();
      const renamedFile = new File([fileObj.file], fileObj.name, { type: fileObj.file.type });
      formData.append("file", renamedFile);

      try {
        await axios.post("https://httpbin.org/post", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress((prev) => ({ ...prev, [fileObj.name]: percent }));
          },
        });
        setGallery((prev) => [...prev, fileObj]);
      } catch {
        setUploadStatus("❌ Upload failed. Please try again.");
        return;
      }
    }
    setUploadStatus("✅ All files uploaded successfully!");
    setFiles([]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleRename = (index, newName) => {
    const updated = [...files];
    updated[index].name = newName;
    setFiles(updated);
  };

  const removeFromGallery = (index) => {
    const updated = [...gallery];
    updated.splice(index, 1);
    setGallery(updated);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const getIcon = (type) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("sheet") || type.includes("excel")) return "📊";
    if (type.includes("word")) return "📑";
    return "📁";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">📁 UploadEase</h1>
      <div className="w-full max-w-2xl bg-white/10 rounded-lg shadow-xl p-6 text-white">
        <div
          className="w-full border-2 border-dashed border-purple-400 rounded-md cursor-pointer p-6 text-center hover:bg-white/10"
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {files.length > 0 ? `${files.length} file(s) ready` : "Click or Drag & Drop files here (Max 10MB)"}
          <input ref={fileInputRef} type="file" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-4">
            {files.map((fileObj, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/20 p-2 rounded-md">
                <div className="flex flex-col w-full mr-2">
                  <input
                    className="bg-transparent border border-white rounded px-2 py-1 text-sm text-white"
                    value={fileObj.name}
                    onChange={(e) => handleRename(idx, e.target.value)}
                  />
                  <span className="text-xs text-white/60">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</span>
                  {fileObj.file.type.startsWith("image") && (
                    <img src={fileObj.url} alt={fileObj.name} className="w-32 mt-2 rounded border border-white" />
                  )}
                </div>
                <button onClick={() => removeFile(idx)} className="bg-red-600 text-xs px-2 py-0.5 rounded">✕</button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!files.length}
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 transition py-2 px-4 rounded text-white disabled:opacity-50"
        >
          Upload File{files.length > 1 && "s"}
        </button>

        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-3">
            {files.map((fileObj) => (
              <div key={fileObj.name}>
                <p className="text-sm mb-1">{fileObj.name}</p>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-400 h-3 rounded-full transition-all"
                    style={{ width: `${uploadProgress[fileObj.name] || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-0.5">{uploadProgress[fileObj.name] || 0}%</p>
              </div>
            ))}
          </div>
        )}

        {uploadStatus && <p className="mt-4 text-sm font-medium text-center">{uploadStatus}</p>}

        {gallery.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">🖼️ Uploaded Files</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((item, idx) => (
                <div key={idx} className="bg-white/20 p-2 rounded-md text-center">
                  <div onClick={() => setModalFile(item)} className="cursor-pointer">
                    {item.type.startsWith("image") ? (
                      <img src={item.url} alt={item.name} className="w-full h-32 object-cover rounded-md border border-white" />
                    ) : (
                      <div className="h-32 flex items-center justify-center bg-gray-800 text-sm rounded-md">
                        <span>{getIcon(item.type)}</span>
                      </div>
                    )}
                    <p className="mt-1 text-xs break-words">{item.name}</p>
                    <p className="text-xs text-white/60">📅 {item.uploadedAt}</p>
                  </div>
                  <div className="mt-1 flex justify-center gap-2">
                    <a href={item.url} download={item.name} className="text-xs bg-green-600 px-2 py-0.5 rounded">
                      Download
                    </a>
                    <button onClick={() => removeFromGallery(idx)} className="text-xs bg-red-600 px-2 py-0.5 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalFile(null)}
        >
          <div className="bg-white p-4 rounded shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto relative">
            <button onClick={() => setModalFile(null)} className="absolute top-2 right-2 text-black font-bold">✕</button>
            {modalFile.type.startsWith("image") ? (
              <img src={modalFile.url} alt={modalFile.name} className="w-full rounded" />
            ) : (
              <iframe
                src={modalFile.url}
                title={modalFile.name}
                className="w-full h-[75vh] border-none"
              ></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
