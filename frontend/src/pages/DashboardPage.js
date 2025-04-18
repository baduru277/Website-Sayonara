import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Card,
  Avatar,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Typography,
  IconButton,
  Box,
  Stack,
  Paper,
  Skeleton,
  Modal,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Edit, VerifiedUser, Phone, Email, Add } from "@mui/icons-material";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailUpdates: true,
  });
  const [openModal, setOpenModal] = useState(false);
  const [itemDetails, setItemDetails] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    type: "sell", // Default to 'sell'
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingItem, setLoadingItem] = useState(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: 2,
    boxShadow: 24,
    padding: 4,
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/profile", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const toggleNotification = useCallback(() => setNotifications((prev) => !prev), []);
  const updatePreferences = useCallback((key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setItemDetails((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleItemSubmit = async () => {
    setLoadingItem(true);
    // Form submission API call to add item
    try {
      const formData = new FormData();
      formData.append("title", itemDetails.title);
      formData.append("description", itemDetails.description);
      formData.append("price", itemDetails.price);
      formData.append("category", itemDetails.category);
      formData.append("type", itemDetails.type);
      if (itemDetails.image) {
        formData.append("image", itemDetails.image);
      }

      await axios.post("http://localhost:5000/api/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      });

      setLoadingItem(false);
      handleModalClose();
      alert("Item listed successfully!");
    } catch (error) {
      console.error("Error submitting item", error);
      setLoadingItem(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        User Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: "center", boxShadow: 3 }}>
            {loading ? (
              <Skeleton variant="circular" width={120} height={120} sx={{ mx: "auto", mb: 2 }} />
            ) : (
              <Avatar src={profile?.profilePicture} sx={{ width: 120, height: 120, mb: 2, mx: "auto" }} />
            )}
            <Typography variant="h6">{profile?.name || "User Name"}</Typography>
            <Typography variant="body2" color="textSecondary">
              {profile?.location || "Location not set"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Contact: {profile?.contactInfo || "No contact info"}
            </Typography>
            <IconButton color="primary" sx={{ mt: 1 }} onClick={() => alert("Edit Profile")}>
              <Edit />
            </IconButton>
          </Card>
        </Grid>

        {/* Verification Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Verification Status
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <Email fontSize="small" /> Email: {profile?.email || "Not provided"}
              </Typography>
              <Typography variant="body2">
                <Phone fontSize="small" /> Phone:{" "}
                {profile?.phoneVerified ? (
                  <Typography component="span" color="success.main">
                    ✔ Verified
                  </Typography>
                ) : (
                  <Typography component="span" color="error.main">
                    ❌ Not Verified
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2">
                <VerifiedUser fontSize="small" /> KYC:{" "}
                {profile?.kycVerified ? (
                  <Typography component="span" color="success.main">
                    ✔ Verified
                  </Typography>
                ) : (
                  <Typography component="span" color="error.main">
                    ❌ Not Verified
                  </Typography>
                )}
              </Typography>
            </Stack>
            <Button variant="contained" size="small" sx={{ mt: 2 }}>
              Verify Now
            </Button>
          </Card>
        </Grid>

        {/* Account Settings */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6">Account Settings</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <FormControlLabel
                control={<Switch checked={notifications} onChange={toggleNotification} />}
                label="Enable Notifications"
              />
              <FormControlLabel
                control={<Switch checked={preferences.darkMode} onChange={() => updatePreferences("darkMode")} />}
                label="Dark Mode"
              />
              <FormControlLabel
                control={<Switch checked={preferences.emailUpdates} onChange={() => updatePreferences("emailUpdates")} />}
                label="Email Updates"
              />
            </Stack>
            <Button variant="contained" size="small" color="secondary" sx={{ mt: 2 }}>
              Change Password
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Add Item Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleModalOpen}
        sx={{ mt: 3 }}
      >
        Add Item
      </Button>

      {/* Modal for Adding Item */}
      <Modal open={openModal} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Add Item for Sale/Bid/Barter
          </Typography>
          <TextField
            label="Item Title"
            fullWidth
            margin="normal"
            name="title"
            value={itemDetails.title}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            name="description"
            multiline
            rows={4}
            value={itemDetails.description}
            onChange={handleChange}
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            name="price"
            type="number"
            value={itemDetails.price}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={itemDetails.category}
              onChange={handleChange}
            >
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="furniture">Furniture</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Item Type</InputLabel>
            <Select
              name="type"
              value={itemDetails.type}
              onChange={handleChange}
            >
              <MenuItem value="sell">Sell</MenuItem>
              <MenuItem value="barter">Barter</MenuItem>
              <MenuItem value="bid">Bid</MenuItem>
            </Select>
          </FormControl>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: 16 }}
          />
          {imagePreview && <img src={imagePreview} alt="preview" width="100%" style={{ marginTop: 16 }} />}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button onClick={handleModalClose} color="secondary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleItemSubmit}
              disabled={loadingItem}
            >
              {loadingItem ? <CircularProgress size={24} /> : "Submit Item"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;