import React from "react";

// Google Fonts injection
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

// Sample Data
const user = {
  name: "Ava Walker",
  avatar: "https://ui-avatars.com/api/?name=Ava+Walker&background=3aafa9&color=fff&size=128&font-size=0.45",
  tagline: "Globetrotter & Adventure Seeker",
  balance: 1850.75,
  followers: 1240,
  followees: 178,
  historicalTrips: [
    {
      destination: "Kyoto, Japan",
      date: "March 2024",
      cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
    },
    {
      destination: "Santorini, Greece",
      date: "July 2023",
      cover: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80"
    },
    {
      destination: "Banff, Canada",
      date: "October 2022",
      cover: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80"
    }
  ]
};

const PrivateAccountProfile = () => (
  <div style={styles.bg}>
    <div style={styles.container}>
      {/* Profile Card */}
      <div style={styles.profileCard}>
        <img
          src={user.avatar}
          alt={user.name}
          style={styles.avatar}
        />
        <div>
          <h2 style={styles.name}>{user.name}</h2>
          <p style={styles.tagline}>{user.tagline}</p>
        </div>
      </div>

      {/* Account Balance & Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Account Balance</div>
          <div style={styles.statValueBalance}>${user.balance.toLocaleString()}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Followers</div>
          <div style={styles.statValue}>{user.followers}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Following</div>
          <div style={styles.statValue}>{user.followees}</div>
        </div>
      </div>

      {/* Historical Travel Plans */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Historical Travel Plans</h3>
        <div style={styles.tripList}>
          {user.historicalTrips.map((trip, i) => (
            <div key={i} style={styles.tripCard}>
              <div
                style={{
                  ...styles.tripCover,
                  backgroundImage: `url(${trip.cover})`
                }}
              />
              <div>
                <div style={styles.tripDest}>{trip.destination}</div>
                <div style={styles.tripDate}>{trip.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={{ ...styles.actionBtn, ...styles.editBtn }}>Edit Profile</button>
        <button style={{ ...styles.actionBtn, ...styles.logoutBtn }}>Logout</button>
      </div>
    </div>
  </div>
);

const styles = {
  bg: {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)",
    fontFamily: "'Poppins', Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2vw"
  },
  container: {
    width: "100%",
    maxWidth: 480,
    background: "#fff",
    borderRadius: 24,
    boxShadow: "0 8px 36px rgba(44, 62, 80, 0.10)",
    padding: "2.2rem 1.3rem 1.7rem 1.3rem",
    boxSizing: "border-box",
    margin: "2rem 0"
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "1.15rem",
    borderBottom: "2px solid #f0f4f8",
    paddingBottom: "1.2rem",
    marginBottom: "1.6rem"
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: "50%",
    boxShadow: "0 2px 10px rgba(58,175,169,0.15)",
    border: "3px solid #3aafa9",
    objectFit: "cover"
  },
  name: {
    margin: 0,
    color: "#2b7a78",
    fontWeight: 700,
    fontSize: "1.55rem",
    letterSpacing: "1px"
  },
  tagline: {
    color: "#3aafa9",
    fontStyle: "italic",
    margin: "0.3rem 0 0 0",
    fontSize: "1.07rem",
    fontWeight: 500
  },
  statsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1.7rem",
    gap: "0.5rem"
  },
  statCard: {
    flex: 1,
    background: "#e0f9f8",
    borderRadius: 12,
    padding: "1rem 0.6rem",
    textAlign: "center",
    margin: "0 0.1rem"
  },
  statLabel: {
    fontSize: "0.97rem",
    color: "#7a8fa2",
    letterSpacing: "0.3px",
    fontWeight: 500,
    marginBottom: "0.2rem"
  },
  statValue: {
    fontSize: "1.27rem",
    color: "#2b7a78",
    fontWeight: 700
  },
  statValueBalance: {
    fontSize: "1.18rem",
    color: "#ff8c42",
    fontWeight: 700,
    letterSpacing: "0.2px"
  },
  section: {
    marginBottom: "2rem"
  },
  sectionTitle: {
    color: "#17252a",
    fontWeight: 600,
    fontSize: "1.18rem",
    margin: "0 0 1rem 0",
    letterSpacing: "0.2px"
  },
  tripList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.15rem"
  },
  tripCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "#f7fafc",
    borderRadius: 12,
    padding: "0.65rem 0.8rem",
    boxShadow: "0 1px 6px rgba(44,62,80,0.07)"
  },
  tripCover: {
    width: 54,
    height: 54,
    borderRadius: 9,
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 2px 7px rgba(58,175,169,0.10)",
    border: "2.5px solid #e3e7f1"
  },
  tripDest: {
    color: "#2b7a78",
    fontWeight: 600,
    fontSize: "1.07rem"
  },
  tripDate: {
    color: "#7a8fa2",
    fontSize: "0.97rem"
  },
  actions: {
    display: "flex",
    gap: "1.1rem",
    marginTop: "1.3rem",
    justifyContent: "center"
  },
  actionBtn: {
    border: "none",
    outline: "none",
    borderRadius: 18,
    padding: "0.55rem 1.7rem",
    fontWeight: 600,
    fontSize: "1.02rem",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(44,62,80,0.13)",
    transition: "background 0.2s, color 0.2s"
  },
  editBtn: {
    background: "linear-gradient(90deg, #3aafa9 60%, #2b7a78 100%)",
    color: "#fff"
  },
  logoutBtn: {
    background: "#f6d365",
    color: "#4e585e"
  }
};

// Responsive design for mobile
// To be included in a CSS file for large projects, but shown here for completeness
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @media (max-width: 600px) {
    .profile-container {
      padding: 1.1rem 0.3rem;
    }
    .profile-stats-row {
      flex-direction: column;
      gap: 0.7rem;
    }
    .profile-trip-list {
      gap: 0.7rem;
    }
    .profile-actions {
      gap: 0.7rem;
      flex-direction: column;
    }
  }
`;
document.head.appendChild(styleTag);

export default PrivateAccountProfile;