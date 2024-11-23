import { Box, Typography, Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';  
import AccordionDetails from '@mui/material/AccordionDetails';  
import AccordionSummary from '@mui/material/AccordionSummary';  
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';  

const faqData = [
  {
    question: "How do I add a post on TravelBuddy?",
    answer: "Go to the 'Add Post' section, upload your travel photos, specify the location, add a caption, and share your journey with the community.",
  },
  {
    question: "Can I edit my post after posting?",
    answer: "Yes, click the three dots on your post, select 'Edit,' make the necessary changes, and save your updates.",
  },
  {
    question: "How do I report inappropriate posts?",
    answer: "Click the three dots on a post, select 'Report,' provide the reason, and our team will review the report promptly.",
  },
  {
    question: "Is the 'Find Buddy' feature in TravelBuddy a premium feature?",
    answer: "Yes, it's a premium feature that connects you with travelers based on your destination and preferences.",
  },
];

const AboutSession = () => (
  <Box
    sx={{
      padding: '50px',
      backgroundColor: '#FFFFFF', 
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: '40px',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    }}
  >
    {/* Left Side: FAQ Accordion */}
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: '#333333', marginBottom: '20px' }}
      >
        Frequently Asked Questions
      </Typography>
      {faqData.map((item, index) => (
        <Accordion key={index} sx={{ backgroundColor: '#F9F9F9', borderRadius: '8px', marginBottom: '10px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: '#F0F0F0',
              color: '#2C2C2C',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#E8E8E8' },
              display: 'flex',
              justifyContent: 'space-between', // Align the question text and icon
            }}
          >
            {item.question}
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '20px', color: '#555555' }}>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>

    {/* Right Side: About Section */}
    <Box
      sx={{
        flex: 1,
        padding: '30px',
        backgroundColor: '#FAFAFA',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#333333' }}>
        About TravelBuddy
      </Typography>
      <Typography sx={{ color: '#555555', marginBottom: '20px' }}>
        TravelBuddy is your ultimate travel companion, helping you connect with travelers, share your experiences, and find your perfect travel buddy. With features like personalized posts and the exclusive "Find Buddy" tool, we make your journey unforgettable.
      </Typography>
      <Button
        variant="contained"
        href="https://travelmedia.cyou"
        sx={{
          color: '#FFFFFF',
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          '&:hover': { color: 'white' },
        }}
      >
        Discover More
      </Button>
    </Box>
  </Box>
);

export default AboutSession;
