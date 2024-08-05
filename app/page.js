'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, count, deleteDoc, doc, docSnap, getDoc, getDocs, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    let inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        quantity: parseInt(doc.data().quantity, 10) || 0,
      });
    });
    
    // Apply search filter if there's a search term
    if (searchTerm.trim() !== '') {
      inventoryList = inventoryList.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setInventory(inventoryList);
  };
    

  const addItem = async (item, itemQuantity = 1) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
  
    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity
      await setDoc(docRef, { quantity: currentQuantity + itemQuantity })
    } else {
      await setDoc(docRef, { quantity: itemQuantity })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
  
    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity
      if (currentQuantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: currentQuantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      updateInventory(); // Reset to full inventory if search is empty
      return;
    }

    const filteredInventory = inventory.filter(item => 
      item.name.toLowerCase().includes(term.toLowerCase())
    );
  };

  useEffect(() => {
    updateInventory();
  }, [searchTerm]);

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  function StepperInput({ value, onChange, min = 1, max = 100 }) {
    return (
      <Box display="flex" alignItems="center">
        <Button 
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          -
        </Button>
        <Typography sx={{ mx: 2 }}>{value}</Typography>
        <Button 
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          +
        </Button>
      </Box>
    )
  }

  return(
    <Box 
    width="100w" 
    height="100vh" 
    display="flex" 
    flexDirection="column"
    justifyContent="center" 
    alignItems="center" 
    gap={2}>
      <TextField
        placeholder="Search item..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ maxWidth: '800px', mb: 2 }}
      />
      <Modal open={open} onClose = {handleClose}>
        <Box 
        position="absolute" 
        top="50%" 
        left="50%" 
        width ={400} 
        bgcolor="white" 
        border="2px solid #000" 
        boxShadow={24} 
        p={4} 
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform: 'translate(-50%, -50%)',
        }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <Box display="flex" flexDirection="row" gap={2}>
              <TextField
                placeholder='Add item here'
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value)
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName, quantity)
                  setItemName('')
                  setQuantity(1)
                  handleClose()
                }}
              >
                Add
              </Button>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <Typography variant="subtitle1">Quantity:</Typography>
              <StepperInput 
                value={quantity} 
                onChange={(newValue) => {
                  setQuantity(newValue)
                }}
                min={1}
              />
            </Box>
          </Stack>
        </Box>
      </Modal>
      {/* <Typography variant="h1">Inventory Management</Typography> */}
      <Button variant="contained"
      onClick={() => {
        handleOpen()
      }}>
        Add New Item
      </Button>
      <Box border="1px solid #333">
        <Box 
        width="800px" 
        height="100px" 
        bgcolor="#ADD8E6" 
        display="flex"
        alignItems="center" 
        justifyContent="center" 
        >
          <Typography variant="h2" color="#333">
            Pantry List
          </Typography>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {inventory.map(({name, quantity})=>(
            <Box 
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgColor="#f0f0f0"
            padding={5}>
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                variant="contained"
                onClick={() => {
                  addItem(name)
                }}>
                  Add
                </Button>
                <Button
                variant="contained"
                onClick={() => {
                  removeItem(name)
                }}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
      </Stack>
      </Box>
    </Box>
  )
}
