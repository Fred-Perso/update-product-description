const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour permettre à Express de parser le JSON
app.use(express.json());

// Endpoint pour récupérer la description du produit depuis WooCommerce
app.get('/product-description', async (req, res) => {
  try {
    const productId = req.query.id; // Récupérer l'ID du produit depuis la requête
    const response = await axios.get(`https://tuto-imprimeur.fr/wp-json/wc/v3/products/${productId}`);
    const productDescription = response.data.description;
    res.json({ description: productDescription });
  } catch (error) {
    console.error('Erreur lors de la récupération de la description du produit :', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la description du produit.' });
  }
});

// Endpoint pour mettre à jour la description du produit dans WooCommerce
app.put('/update-product-description', async (req, res) => {
  try {
    const { id, newDescription } = req.body; // Récupérer l'ID du produit et la nouvelle description depuis la requête
    const response = await axios.put(`https://tuto-imprimeur.fr/wp-json/wc/v3/products/${id}`, { description: newDescription });
    res.json({ message: 'La description du produit a été mise à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la description du produit :', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la description du produit.' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

