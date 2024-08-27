import React, { useState } from 'react';
import './AddPost.css';
import axios from 'axios';

interface PostData {
  file: File | null;
  caption: string;
}

const AddPost: React.FC = () => {
  const [postData, setPostData] = useState<PostData>({
    file: null,
    caption: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPostData({ ...postData, file: e.target.files[0] });
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData({ ...postData, caption: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!postData.file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', postData.file); // Use postData.file
    formData.append('caption', postData.caption);

    try {
      const response = await axios.post('http://your-backend-endpoint/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Post uploaded successfully!');
        setPostData({ file: null, caption: '' });
      }
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('Failed to upload post.');
    }
  };

  return (
    <div className="add-post-container" style={{ marginLeft: '30%' }}>
      <h2>Add a New Post</h2>
      <form className="add-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">Upload Image/Video:</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="caption">Caption:</label>
          <textarea
            id="caption"
            rows={4}
            value={postData.caption}
            onChange={handleCaptionChange}
            placeholder="Write a caption..."
          ></textarea>
        </div>
        <button type="submit" className="submit-button">Post</button>
      </form>
    </div>
  );
};

export default AddPost;
