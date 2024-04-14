import React, { useState } from 'react';
import axios from 'axios';
import '../FileUploader/FileUploader.css';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const userData = JSON.parse(localStorage.getItem('userData'));

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles); // Only take the first file
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true });

  const handleUpload = async () => {

    const data = {files: file}

    try {
      const config = {headers: {'Authorization': 'Bearer: ' + userData.token, 'Content-Type': 'multipart/form-data'}};
      const response = await axios.post('http://localhost:5000/media/create_media', data, config);
      console.log('File uploaded successfully');
      // Call the onUploadSuccess callback with the URL
      if (onUploadSuccess && response.data) {
        onUploadSuccess(response.data); // Assuming response.data is the URL
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className='container'>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop a file here, or click to select a file</p>
      </div>
      {file && (
        <div>
          <p>Selected file:</p>
          <ul>
            <li>{file.name}</li>
          </ul>
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;