import { Box, Container, Typography } from "@mui/material";
import StreamingVideo from "../../components/common/StreamingVideo";

const Hero = () => {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      <StreamingVideo
        src="/Benjamin.Grauer.3D.Show_6.mp4"
        autoPlay
        muted
        loop
        playsInline
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          opacity: 0.3,
        }}
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video ready to play')}
        onError={(error) => console.error('Video error:', error)}
      />

      {/* Overlay for better text readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ maxWidth: "800px", margin: "0 auto" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 900,
              mb: 3,
              color: "white",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            My name is Benjamin Grauer
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              fontWeight: 500,
              mb: 2,
              color: "white",
              lineHeight: 1.6,
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            Electrical Engineer, Software Developer, Project Manager, Father,
            Triathlete
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.6,
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            I like everything that helps the planet and brings the world forward
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
