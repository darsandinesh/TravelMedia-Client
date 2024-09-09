import React, { useState } from 'react';
import Button from '@mui/material/Button';

interface AddTravelModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const AddTravelModal: React.FC<AddTravelModalProps> = ({ open, setOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    travelDate: '',
    travelType: '',
    location: '',
    description: '',
    maxParticipants: 5,
    isPrivate: false,
    travelDuration: 0,
    preferences: {
      budget: 'medium',
      accommodation: 'hotel',
      transportMode: 'car',
    },
    mediaUrls: [] as string[],
  });

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (data: typeof formData) => {
    console.log('Form Submitted:', data);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      travelDate: '',
      travelType: '',
      location: '',
      description: '',
      maxParticipants: 5,
      isPrivate: false,
      travelDuration: 0,
      preferences: {
        budget: 'medium',
        accommodation: 'hotel',
        transportMode: 'car',
      },
      mediaUrls: [],
    });
    setStep(1);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] h-[500px] relative">
        {/* Close button */}
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setOpen(false);
            resetForm();
          }}
          className="absolute top-2 right-2"
        >
          Close
        </Button>

        {/* Modal Content */}
        <div className="flex flex-col h-full">
          {/* Step Content */}
          <div className="flex-1 flex flex-col justify-center items-center">
            {step === 1 && (
              <div className="w-full max-w-md " >
                <h2 className="text-2xl font-bold mb-6 text-center">Step 1: Travel Info</h2>
                <div className="mb-4 " style={{marginLeft:'20%'}}>
                  <label className="block text-sm mb-2 ">Travel Date</label>
                  <input
                    type="date"
                    className="border border-gray-300 p-2 w-full rounded-md"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Location</label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded-md"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Description</label>
                  <textarea
                    className="border border-gray-300 p-2 w-full rounded-md"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Step 2: Preferences</h2>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Budget</label>
                  <select
                    className="border border-gray-300 p-2 w-full rounded-md"
                    value={formData.preferences.budget}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, budget: e.target.value },
                    })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Accommodation</label>
                  <select
                    className="border border-gray-300 p-2 w-full rounded-md"
                    value={formData.preferences.accommodation}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, accommodation: e.target.value },
                    })}
                  >
                    <option value="hotel">Hotel</option>
                    <option value="hostel">Hostel</option>
                    <option value="airbnb">Airbnb</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Transport Mode</label>
                  <select
                    className="border border-gray-300 p-2 w-full rounded-md"
                    value={formData.preferences.transportMode}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, transportMode: e.target.value },
                    })}
                  >
                    <option value="car">Car</option>
                    <option value="train">Train</option>
                    <option value="plane">Plane</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Step 3: Media Upload</h2>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Upload Media</label>
                  <input
                    type="file"
                    multiple
                    className="border border-gray-300 p-2 w-full rounded-md"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const urls = files.map(file => URL.createObjectURL(file));
                      setFormData({ ...formData, mediaUrls: urls });
                    }}
                  />
                  <div className="mt-4 flex gap-4 flex-wrap">
                    {formData.mediaUrls.map((url, index) => (
                      <img key={index} src={url} alt={`Upload ${index}`} className="h-24 w-24 object-cover rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Review and Submit</h2>
                <div className="mb-4 flex flex-col items-center">
                  <h3 className="text-lg font-semibold">Travel Date:</h3>
                  <p>{formData.travelDate}</p>
                  <h3 className="text-lg font-semibold mt-2">Location:</h3>
                  <p>{formData.location}</p>
                  <h3 className="text-lg font-semibold mt-2">Description:</h3>
                  <p>{formData.description}</p>
                  <h3 className="text-lg font-semibold mt-2">Preferences:</h3>
                  <p>Budget: {formData.preferences.budget}</p>
                  <p>Accommodation: {formData.preferences.accommodation}</p>
                  <p>Transport Mode: {formData.preferences.transportMode}</p>
                  <h3 className="text-lg font-semibold mt-2">Media:</h3>
                  <div className="flex gap-4 flex-wrap">
                    {formData.mediaUrls.map((url, index) => (
                      <img key={index} src={url} alt={`Review ${index}`} className="h-24 w-24 object-cover rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            {step > 1 && (
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-4"
                onClick={handlePrevStep}
              >
                Previous
              </button>
            )}
            {step < 4 ? (
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 gap-4"
                onClick={handleNextStep}
              >
                Next
              </button>
            ) : (
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                onClick={() => handleSubmit(formData)}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTravelModal;
