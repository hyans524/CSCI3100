import React from "react";

// Import Google Fonts in the document head
const addGoogleFont = () => {
  const id = "google-font-poppins";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
};
addGoogleFont();

const TravelWebsiteProfile = () => {
  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>WeTravel</h1>
          <p style={styles.tagline}>Discover your next adventure</p>
        </header>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>About Us</h2>
          <p style={styles.text}>
            WeTravel is your gateway to exploring the world's most breathtaking destinations.
            Whether you're looking for solo travel tips, family vacation ideas, or hidden gems off the beaten path,
            WeTravel connects you with unforgettable experiences and exclusive deals.
          </p>
        </section>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Key Features</h2>
          <ul style={styles.featuresList}>
            <li>Curated destination guides and itineraries</li>
            <li>Personalized trip recommendations</li>
            <li>Seamless booking for flights, hotels, and activities</li>
            <li>User reviews and travel stories</li>
            <li>24/7 customer support</li>
          </ul>
        </section>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact Us</h2>
          <p style={styles.text}>
            <strong>Email:</strong> <a style={styles.link} href="mailto:support@wanderly.com">support@wetravel.com</a><br />
            <strong>Phone:</strong> <a style={styles.link} href="tel:+15551234567">+1 (555) 123-4567</a>
          </p>
          <div style={styles.socials}>
            <a
              href="https://instagram.com/WeTravel"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.socialBtn, ...styles.instagram }}
            >Instagram</a>
            <a
              href="https://twitter.com/WeTravel"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.socialBtn, ...styles.twitter }}
            >Twitter</a>
          </div>
        </section>
      </div>
    </div>
  );
};

// Responsive styles
const styles = {
  bg: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
    fontFamily: "'Poppins', Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2vw",
  },
  container: {
    maxWidth: "480px",
    width: "100%",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 36px rgba(44, 62, 80, 0.09)",
    padding: "2rem",
    margin: "2rem 0",
    boxSizing: "border-box",
  },
  header: {
    borderBottom: "2px solid #f0f4f8",
    marginBottom: "1.8rem",
    paddingBottom: "1.2rem",
    textAlign: "center",
  },
  title: {
    margin: 0,
    color: "#2b7a78",
    fontWeight: 700,
    fontSize: "2.3rem",
    letterSpacing: "1.5px",
  },
  tagline: {
    color: "#3aafa9",
    fontStyle: "italic",
    marginTop: "0.4rem",
    fontSize: "1.15rem",
    fontWeight: 500,
    letterSpacing: "0.5px",
  },
  section: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    color: "#17252a",
    fontWeight: 600,
    fontSize: "1.25rem",
    margin: "0 0 0.7rem 0",
    letterSpacing: "0.5px",
  },
  text: {
    color: "#3b444b",
    fontSize: "1.03rem",
    lineHeight: 1.7,
    marginBottom: "0.7rem",
  },
  featuresList: {
    color: "#2b7a78",
    paddingLeft: "1.2rem",
    lineHeight: 1.8,
    fontSize: "1.03rem",
    marginBottom: 0,
  },
  link: {
    color: "#46b9b9",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.2s",
  },
  socials: {
    display: "flex",
    gap: "1rem",
    marginTop: "0.7rem",
  },
  socialBtn: {
    display: "inline-block",
    background: "#e7fbff",
    color: "#2b7a78",
    borderRadius: "22px",
    padding: "0.45rem 1.1rem",
    fontWeight: 600,
    fontSize: "1rem",
    textDecoration: "none",
    boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
    transition: "background 0.2s, color 0.2s",
  },
  instagram: {
    background: "linear-gradient(90deg,#fdc468,#df4996)",
    color: "#fff",
  },
  twitter: {
    background: "linear-gradient(90deg, #1da1f2 40%, #0c7abf 100%)",
    color: "#fff",
  },
};

export default TravelWebsiteProfile;