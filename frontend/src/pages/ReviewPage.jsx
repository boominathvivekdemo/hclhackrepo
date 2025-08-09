import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';

function ReviewPage() {
  const location = useLocation();
  const { shippingAddress, deliveryAddress, estimatedDeliveryDate, paymentInfo } = location.state || {};

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Review Your Order
      </Typography>

      <Divider sx={{ marginY: 2 }} />

      <Typography variant="h6">Shipping Address</Typography>
      <Typography>{shippingAddress || 'Not Provided'}</Typography>

      <Divider sx={{ marginY: 2 }} />

      <Typography variant="h6">Delivery Address</Typography>
      <Typography>{deliveryAddress || 'Not Provided'}</Typography>

      <Divider sx={{ marginY: 2 }} />

      <Typography variant="h6">Estimated Delivery Date</Typography>
      <Typography>{estimatedDeliveryDate || 'Not Available'}</Typography>

      <Divider sx={{ marginY: 2 }} />

      <Typography variant="h6">Payment Information</Typography>
      <List>
        {paymentInfo?.map((method, index) => (
          <ListItem key={index}>
            <ListItemText primary={method} />
          </ListItem>
        )) || <Typography>No Payment Information Provided</Typography>}
      </List>
    </Box>
  );
}

export default ReviewPage;
