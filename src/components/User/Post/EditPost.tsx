import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Home/NavBar/NavBar';
import { useLocation } from 'react-router-dom';
import LinearProgress from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import { toast } from 'sonner';
import axiosInstance from '../../../constraints/axios/userAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';

interface ImageData {
    file: File | null;
    previewUrl: string;
}

const EditPost = () => {
    const location = useLocation();
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [serverImages, setServerImages] = useState<ImageData[]>([]);
    const [newImages, setNewImages] = useState<ImageData[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null); // File input ref

    useEffect(() => {
        const postData = location.state.data;
        console.log(postData)
        setAddress(postData.location);
        setDescription(postData.description);

        // If there are images already, add them to the state
        if (postData.imageUrl) {
            const initialImages = postData.imageUrl.map((url: string) => ({
                file: null, // These are server-loaded images, so no file
                previewUrl: url,
            }));
            setServerImages(initialImages);
        }
    }, [location]);

    const [progress, setProgress] = React.useState(0);
    const [loading, setLoading] = useState<boolean>(false);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    // Handle new image uploads
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file), // Create preview URL
            }));
            setNewImages([...newImages]);
        }
    };

    // Remove an image
    const handleRemoveImage = async (index: number, type: 'server' | 'new') => {
        if (type === 'server') {
            const result = await axiosInstance.put(postEndpoints.deleteImage, {
                index: index,
                postId: location.state.data._id
            })
            console.log(result);
            if (result.data.success) {
                const updatedImages = serverImages.filter((_, i) => i !== index);
                setServerImages(updatedImages);
            } else {
                toast.info('Something went Wrong, try again')
            }

        } else {
            const updatedImages = newImages.filter((_, i) => i !== index);
            setNewImages(updatedImages);

            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input if needed
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // setLoading(true);

        const formData = new FormData();
        formData.append('address', address);
        formData.append('description', description);
        formData.append('userId', location.state.data.userId);
        formData.append('postId', location.state.data._id)

        // Append newly uploaded images (those with files)
        newImages.forEach((imageData) => {
            if (imageData.file) {
                formData.append('images', imageData.file);
            }
        });

        console.log('Updated Post:', {
            address,
            description,
            images: newImages.map((img) => img.previewUrl),
        });

        try {
            const result = await axiosInstance.put(postEndpoints.editPost,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )

            console.log(result, 'after the updation ');
        } catch (error) {
            console.log('Error in updation', error);
            toast.error('Unable to update, try again')
        }


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
                            value={address}
                            onChange={handleAddressChange}
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
                                            backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            width: '25px',
                                            height: '25px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upload New Images */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold' }}>Upload New Images:</label>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{
                                display: 'block',
                                marginTop: '8px',
                                marginBottom: '15px',
                                color: 'white',
                            }}
                        />

                        {/* Preview of Newly Added Images */}
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                justifyContent: 'center',
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
                                            backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            width: '25px',
                                            height: '25px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    {
                        loading
                            ?
                            <Box sx={{ bgcolor: 'white', width: '100%' }}>
                                <LinearProgress
                                    determinate
                                    variant="outlined"
                                    color="success"
                                    size="sm"
                                    thickness={32}
                                    value={progress}
                                    sx={{
                                        '--LinearProgress-radius': '0px',
                                        '--LinearProgress-progressThickness': '24px',
                                        boxShadow: 'sm',
                                        borderColor: 'neutral.500',
                                    }}
                                >
                                    <Typography
                                        level="body-xs"
                                        textColor="common.white"
                                        sx={{ fontWeight: 'xl', mixBlendMode: 'difference' }}
                                    >
                                        {
                                            Math.round(progress) == 100
                                                ?
                                                'Completed'
                                                :
                                                `UPLOADING… {${Math.round(progress)}%}`
                                        }

                                    </Typography>
                                </LinearProgress>
                            </Box>
                            :
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '12px 0',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                            >
                                Save Changes
                            </button>
                    }




                </form>
            </div>
        </>
    );
};

export default EditPost;
