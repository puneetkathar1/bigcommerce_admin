import admin from 'firebase-admin';
import serviceAccount from '../../../eb-markup-live-firebase-adminsdk-z5o9e-4f16abb374.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://eb-markup-live.firebaseio.com/"
  });
}

export default function handler(req, res) {
  // Get a reference to your database
  const db = admin.database();
  const markupRef = db.ref('markup');

  // Handle GET requests to retrieve the markup variables
  if (req.method === 'GET') {
    markupRef.once('value', (snapshot) => {
      const markup = snapshot.val();
      res.status(200).json(markup);
    });
  }

  // Handle POST requests to update the markup variables
  if (req.method === 'POST') {
    const { MetalMarkup, TypeMarkup, WeightMarkup, BrandMarkup } = req.body;

    // Update the markup variables
    markupRef.update({
      MetalMarkup,
      TypeMarkup,
      WeightMarkup,
      BrandMarkup
    }, (error) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while updating the markup variables.' });
      } else {
        res.status(200).json({ message: 'Markup variables updated successfully.' });
      }
    });
  }
}
