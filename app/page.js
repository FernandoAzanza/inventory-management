'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        displayName: capitalizeFirstLetter(doc.id),
        ...doc.data(),
      });
    });
    setInventory(inventoryList.sort((a, b) => b.name.localeCompare(a.name))); // Sort by name in reverse order to ensure the newest is on top
  };

  const addItem = async (item) => {
    const lowerCaseItem = item.toLowerCase();
    const docRef = doc(collection(firestore, "inventory"), lowerCaseItem);
    const docSnap = await getDoc(docRef);

    let newItem = { name: lowerCaseItem, displayName: capitalizeFirstLetter(item), quantity: 1 };

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
      newItem.quantity = quantity + 1;
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    setInventory(prevInventory => {
      const updatedInventory = prevInventory.filter(i => i.name !== lowerCaseItem);
      return [newItem, ...updatedInventory];
    });
  };

  const removeItem = async (item) => {
    const lowerCaseItem = item.toLowerCase();
    const docRef = doc(collection(firestore, "inventory"), lowerCaseItem);
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

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="start" gap={2} paddingTop={2}>
      <Box width="800px" position="fixed" top={0} bgcolor="white" zIndex={1} display="flex" flexDirection="column" alignItems="center" paddingTop={2} paddingBottom={2} borderBottom="1px solid #ccc">
        <Button variant="contained" onClick={handleOpen} style={{ marginBottom: 16 }}>ADD NEW ITEM</Button>
        <Box border="1px solid #333" width="100%" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center" padding={2}>
          <Typography variant="h4" color="#333">Inventory Items</Typography>
        </Box>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%,-50%)" }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <Button variant="outlined" onClick={() => { addItem(itemName); setItemName(''); handleClose(); }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Box width="800px" marginTop="200px" overflow="auto" height="calc(100vh - 200px)">
        <Stack spacing={2}>
          {inventory.map(({ name, quantity, displayName }) => (
            <Box key={name} display="flex" alignItems="center" justifyContent="space-between" padding={2} borderBottom="1px solid #ccc">
              <Typography variant="h5" flex={1}>{displayName}</Typography>
              <Box display="flex" alignItems="center" style={{ minWidth: '50px', textAlign: 'center' }}>
                <Typography variant="h5">{quantity}</Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Button variant="contained" onClick={() => addItem(name)}>ADD</Button>
                <Button variant="contained" onClick={() => removeItem(name)}>REMOVE</Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
