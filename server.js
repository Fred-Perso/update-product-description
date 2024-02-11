require('dotenv').config(); // Charger les variables d'environnement à partir de .env

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Vérifier que les clés API sont définies
if (!consumerKey || !consumerSecret) {
  console.error('Les clés API WooCommerce ne sont pas définies.');
  process.exit(1); // Arrêter l'application
}

// Middleware pour permettre à Express de parser le JSON
app.use(express.json());

// Endpoint pour récupérer la description du produit depuis WooCommerce
app.get('/product-description', async (req, res) => {
  try {
    const productID = 16;
    const response = await axios.get(`https://tuto-imprimeur.fr/wp-json/wc/v3/products/${productID}`, {
      auth: {
        username: consumerKey,
        password: consumerSecret
      }
    });
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
    const response = await axios.put(`https://tuto-imprimeur.fr/wp-json/wc/v3/products/${id}`, { description: newDescription }, {

   
      auth: {
        username: consumerKey,
        password: consumerSecret
      }
    });
    res.json({ message: 'La description du produit a été mise à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la description du produit :', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la description du produit.' });
  }
});

$(document).ready(function() {
    // Récupérer la description du produit depuis le serveur
    $.ajax({
        url: '/product-description', // Endpoint pour récupérer la description du produit
        method: 'GET',
        success: function(response) {
            console.log(response); // Ajoutez cette ligne pour afficher la réponse dans la console du navigateur
            $('#product-description').html(response.description);
        },
        error: function(error) {
            console.error('Erreur lors de la récupération de la description du produit :', error);
            $('#product-description').html('Erreur lors de la récupération de la description du produit.');
        }
    });
});


// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
