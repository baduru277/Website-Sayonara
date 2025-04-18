import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Button, TextField, Select, MenuItem, IconButton, Grid, Typography, Box } from "@mui/material";
import { Favorite, FavoriteBorder, Edit, Delete } from "@mui/icons-material";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    price: "",
    category: "barter",
  });
  const [editing, setEditing] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:5000/api/listings")
      .then((response) => setListings(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleInputChange = (e) => {
    setNewListing({ ...newListing, [e.target.name]: e.target.value });
  };

  const addListing = () => {
    axios.post("http://localhost:5000/api/listings", newListing)
      .then((response) => setListings([...listings, response.data]))
      .catch((error) => console.log(error));
    setNewListing({ title: "", description: "", price: "", category: "barter" });
  };

  const updateListing = () => {
    axios.put(`http://localhost:5000/api/listings/${editing._id}`, newListing)
      .then((response) => {
        setListings(listings.map((list) => (list._id === editing._id ? response.data : list)));
        setEditing(null);
        setNewListing({ title: "", description: "", price: "", category: "barter" });
      })
      .catch((error) => console.log(error));
  };

  const deleteListing = (id) => {
    axios.delete(`http://localhost:5000/api/listings/${id}`)
      .then(() => setListings(listings.filter((list) => list._id !== id)))
      .catch((error) => console.log(error));
  };

  const toggleFavorite = (id) => {
    setFavorites(favorites.includes(id) ? favorites.filter((fav) => fav !== id) : [...favorites, id]);
  };

  return (
    <div className="container mt-5">
      <Typography variant="h4" gutterBottom>Listings</Typography>

      {/* Create or Edit Listing Form */}
      <Card className="shadow-lg p-3 mb-4">
        <CardContent>
          <Typography variant="h6">{editing ? "Edit Listing" : "Create Listing"}</Typography>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={newListing.title}
            onChange={handleInputChange}
            className="mb-3"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newListing.description}
            onChange={handleInputChange}
            className="mb-3"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            value={newListing.price}
            onChange={handleInputChange}
            className="mb-3"
            type="number"
            variant="outlined"
          />
          <Select
            fullWidth
            name="category"
            value={newListing.category}
            onChange={handleInputChange}
            className="mb-3"
            variant="outlined"
          >
            <MenuItem value="barter">Barter</MenuItem>
            <MenuItem value="bidding">Bidding</MenuItem>
            <MenuItem value="buy/sell">Buy/Sell</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={editing ? updateListing : addListing}
          >
            {editing ? "Update Listing" : "Create Listing"}
          </Button>
        </CardContent>
      </Card>

      {/* Filters for Active, Pending, Completed */}
      <Select
        fullWidth
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4"
        variant="outlined"
      >
        <MenuItem value="all">All Listings</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </Select>

      {/* Display Listings */}
      <Grid container spacing={4}>
        {listings
          .filter((list) => filter === "all" || list.status === filter)
          .map((list) => (
            <Grid item xs={12} sm={6} md={4} key={list._id}>
              <Card className="shadow-lg p-3">
                <CardContent>
                  <Typography variant="h6">{list.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{list.description}</Typography>
                  <Typography variant="body1" className="mt-2">Price: ${list.price}</Typography>
                  <Typography variant="body2" color="textSecondary">Status: {list.status}</Typography>
                  <Box mt={2} className="d-flex align-items-center justify-content-between">
                    <IconButton onClick={() => toggleFavorite(list._id)}>
                      {favorites.includes(list._id) ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                    <Box>
                      <IconButton onClick={() => { setNewListing(list); setEditing(list); }}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => deleteListing(list._id)}>
                        <Delete color="secondary" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default Listings;