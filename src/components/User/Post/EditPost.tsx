import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Home/NavBar/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import { toast } from 'sonner';
import axiosInstance from '../../../constraints/axios/userAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import axios from 'axios';

interface ImageData {
    file: File | null;
    previewUrl: string;
}

const EditPost = () => {
    const location = useLocation();
    const [description, setDescription] = useState('');
    const [serverImages, setServerImages] = useState<ImageData[]>([]);
    const [newImages, setNewImages] = useState<ImageData[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [query, setQuery] = useState('');
    const [places, setPlaces] = useState<{ description: string }[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const postData = location.state.data;
        setQuery(postData.location);
        setDescription(postData.description);

        if (postData.imageUrl) {
            const initialImages = postData.imageUrl.map((url: string) => ({
                file: null,
                previewUrl: url,
            }));
            setServerImages(initialImages);
        }
    }, [location]);

    const [progress, setProgress] = React.useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [saveData, setSave] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
            }));
            setNewImages([...newImages]);
        }
    };

    const handleRemoveImage = async (index: number, type: 'server' | 'new') => {
        if (type === 'server') {
            const result = await axiosInstance.put(postEndpoints.deleteImage, {
                index: index,
                postId: location.state.data._id,
            });
            if (result.data.success) {
                const updatedImages = serverImages.filter((_, i) => i !== index);
                setServerImages(updatedImages);
            } else {
                toast.info('Something went wrong, try again');
            }
        } else {
            const updatedImages = newImages.filter((_, i) => i !== index);
            setNewImages(updatedImages);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSave(true);

        const formData = new FormData();
        formData.append('place', query);
        formData.append('description', description);
        formData.append('userId', location.state.data.userId);
        formData.append('postId', location.state.data._id);

        newImages.forEach((imageData) => {
            if (imageData.file) {
                formData.append('images', imageData.file);
            }
        });

        try {
            const result = await axiosInstance.put(postEndpoints.editPost, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (result.data.success) {
                navigate('/home');
                toast.success('Post edit successful');
            }
            setSave(false);
        } catch (error) {
            console.error('Error in updating', error);
            toast.error('Unable to update, try again');
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) {
                fetchPlaces(query);
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const fetchPlaces = async (searchQuery: string) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://api.olamaps.io/places/v1/autocomplete?input=${searchQuery}&api_key=${import.meta.env.VITE_OLA_API_KEY}`);
            if (response.data) {
                setPlaces(response.data.predictions);
            } else {
                setPlaces([]);
            }
        } catch (err) {
            setError('Error fetching places');
        }

        setLoading(false);
    };

    const handlePlaceSelect = (placeDescription: string) => {
        setQuery(placeDescription);
        setPlaces([]);
    };

    return (
        <>
            <Navbar />
            <div
                style={{
                    maxWidth: '600px',
                    margin: '20px auto',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    marginTop: '6%',
                    backgroundColor: '#1f2937',
                    color: 'white',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'wheat' }}>Edit Post</h2>
                <form onSubmit={handleSubmit}>
                    {/* Address (Location) */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="address" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                            Location:
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                backgroundColor: '#213547',
                                color: 'white',
                            }}
                        />
                        {loading && <p style={{ color: 'white' }}>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#1f2937' }}>
                            {places.length > 0 &&
                                places.map((place, index) => (
                                    <li key={index} onClick={() => handlePlaceSelect(place.description)} style={{ cursor: 'pointer', color: 'white', marginBottom: '5px', padding: '8px', borderBottom: '1px solid #ccc', transition: 'background-color 0.3s', ':hover': { backgroundColor: '#2a2e35' } }}>
                                        {place.description}
                                    </li>
                                ))}
                        </ul>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="description" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                            Description:
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                backgroundColor: '#213547',
                                color: 'white',
                            }}
                        />
                    </div>

                    {/* Already Uploaded Images (from server) */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold' }}>Existing Images:</label>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                marginBottom: '15px',
                                justifyContent: 'center',
                            }}
                        >
                            {serverImages.map((imgData, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img
                                        src={imgData.previewUrl}
                                        alt={`post-image-${index}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index, 'server')}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* New Image Upload */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>Upload New Images:</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ marginTop: '8px' }}
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                marginTop: '10px',
                            }}
                        >
                            {newImages.map((imgData, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img
                                        src={imgData.previewUrl}
                                        alt={`new-image-${index}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index, 'new')}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type="submit" disabled={saveData} color="primary">
                            {saveData ? <LinearProgress style={{ width: '100%', height: '5px' }} /> : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditPost;
