"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredItems(inventoryList);
  };

  /* Add items */
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  /* Remove items */
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredItems(inventory);
    } else {
      const filtered = inventory.filter(item => item.name.toLowerCase().includes(query));
      setFilteredItems(filtered);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundColor: "#ADD8E6",
        padding: 4,
      }}
    >
      <Box
        width="100%"
        height="200px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="primary.main"
        mb={4}
      >
        <Typography variant="h2" color="white">
          Inventory Management
        </Typography>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={1}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ marginBottom: 4 }}
      >
        Add New Item
      </Button>

      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search items..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ 
          marginBottom: 4, 
          width: '80%', 
          backgroundColor: 'white',
          borderRadius: 1 
        }}
      />

      <Box
        width="80%"
        maxHeight="60%"
        bgcolor="white"
        borderRadius={1}
        boxShadow={2}
        overflow="auto"
        padding={2}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h4" color="textPrimary" align="center">
          Inventory Items
        </Typography>
        {filteredItems.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f9f9f9"
            borderRadius={1}
            padding={2}
            boxShadow={1}
            sx={{
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <Typography variant="h6" color="textPrimary">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {quantity}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addItem(name);
                }}
              >
                Add
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  removeItem(name);
                }}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
