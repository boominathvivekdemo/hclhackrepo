import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';

function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please login to add to cart');
      return;
    }
    const newCart = [...cart, { ...product, quantity: 1 }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
    alert('Added to cart!');
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  // Group products by category
  const grouped = filtered.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', fontFamily: 'Amazon Ember, Arial, sans-serif', color: '#232f3e' }}>
        Products
      </Typography>
      <TextField
        fullWidth
        label="Search products..."
        variant="outlined"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />
      {Object.keys(grouped).length === 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1">No products found.</Typography>
        </Box>
      )}
      {Object.entries(grouped).map(([category, items]) => (
        <Box key={category} sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, color: '#ff9900', fontWeight: 'bold', fontFamily: 'Amazon Ember, Arial, sans-serif' }}>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {items.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image || 'https://via.placeholder.com/200x180?text=No+Image'}
                    alt={product.name}
                    sx={{ objectFit: 'contain', background: '#fff', p: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ background: '#ffd814', color: '#232f3e', fontWeight: 'bold', '&:hover': { background: '#f7ca00' } }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
}

export default Products;
