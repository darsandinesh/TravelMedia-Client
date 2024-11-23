import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Buttons from '@mui/joy/Button';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../constraints/axios/userAxios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/sotre";
import { postEndpoints } from "../../../constraints/endpoints/postEndpoints";
import { useNavigate } from "react-router-dom";

const steps = ["Post Details", "Upload Media", "Preview & Save"];

interface PostData {
  description: string;
  place: string;
  files: File[];
  filePreviews: string[];
}

export default function AddPost() {
  const [activeStep, setActiveStep] = useState(0);
  const [postData, setPostData] = useState<PostData>({
    description: "",
    place: "",
    files: [],
    filePreviews: [],
  });
  const [skipped, setSkipped] = useState(new Set<number>());
  const [errors, setErrors] = useState({
    description: false,
    place: false,
    file: false,
  });
  const [loading, setLoading] = useState<boolean>(false)

  const navigate = useNavigate();

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const validateStep = () => {
    let newErrors = { description: false, place: false, file: false };
    let isValid = true;

    if (activeStep === 0) {
      if (!postData.description.trim()) {
        newErrors.description = true;
        isValid = false;
      }
      if (!postData.place.trim()) {
        newErrors.place = true;
        isValid = false;
      }
    } else if (activeStep === 1) {
      if (postData.files.length === 0) {
        newErrors.file = true;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setPostData({
      description: "",
      place: "",
      files: [],
      filePreviews: [],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = postData.files.filter((_, i) => i !== index);
    const updatedFilePreviews = postData.filePreviews.filter((_, i) => i !== index);
    setPostData({ ...postData, files: updatedFiles, filePreviews: updatedFilePreviews });
  };

  const userId = useSelector((state: RootState) => state.userAuth?.userData?._id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const filePreviews = files.map((file) => URL.createObjectURL(file));
      setPostData({ ...postData, files, filePreviews });
    }
  };

  const handleSubmit = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append("description", postData.description);
    formData.append("place", postData.place);
    formData.append("userId", userId ?? "");

    postData.files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axiosInstance.post(postEndpoints.addPost, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        toast.success("Post uploaded successfully!");
        handleReset();
        navigate('/home')
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      toast.error("Failed to upload post.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "90%", sm: "600px" }, // Responsive max width
        margin: "0 auto",
        mt: 6,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #2d3748",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Enhanced shadow for better visual appeal
        backgroundColor: "#ffffff",
        p: { xs: 2, sm: 3 }, // Padding adjusted for mobile and larger screens
        overflow: "hidden", // Avoids content overflow
      }}
    >
      {/* Stepper at the top */}
      <Box sx={{ width: "100%", mb: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Main content */}
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1, textAlign: "center", fontWeight: "bold" }}>
            🎉 All steps completed - you're finished!
          </Typography>
          <Button onClick={handleReset} variant="outlined" sx={{ mt: 2 }}>
            Reset
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ mt: 2, width: "100%", textAlign: "center" }}>
            {activeStep === 0 && (
              <>
                <TextField
                  label="Place Visited"
                  name="place"
                  value={postData.place}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={errors.place}
                  helperText={errors.place ? "Place is required" : ""}
                />

                <TextField
                  label="Description"
                  name="description"
                  value={postData.description}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                  error={errors.description}
                  helperText={errors.description ? "Description is required" : ""}
                />
              </>
            )}
            {activeStep === 1 && (
              <>
                <Typography sx={{ mb: 2, fontWeight: "bold" }}>
                  Upload images or videos:
                </Typography>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                />
                {errors.file && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    At least one file is required
                  </Typography>
                )}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  {postData.filePreviews.map((preview, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                        }}
                        onClick={() => window.open(preview, "_blank")}
                      />
                      <Button
                        sx={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "50%",
                          padding: "4px",
                          minWidth: "0",
                          height: "24px",
                          width: "24px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          "&:hover": { backgroundColor: "darkred" },
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✕
                      </Button>
                    </Box>
                  ))}
                </Box>
              </>
            )}
            {activeStep === 2 && (
              <>
                <Typography sx={{ fontWeight: "bold", mb: 2 }}>Preview:</Typography>
                <Typography variant="h6">Place: {postData.place}</Typography>
                <Typography>Description: {postData.description}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Media:
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  {postData.filePreviews.map((preview, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "100px",
                        height: "100px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              mt: 3,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <>
                {loading ? <Buttons loading variant="outlined">Loading</Buttons> : <Button variant="contained" color="primary" disabled={loading} onClick={handleSubmit}>  Submit </Button>}
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </React.Fragment>
      )}
    </Box>

  );
}
