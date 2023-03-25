export default async function handler(req, res) {
  try {
    const { authorization } = req.headers

    //Metal to check
    const metalPrices = {
      Gold: 'XAU',
      Silver: 'XAG',
      Platinum: 'XPT',
      Palladium: 'XPD',
    }

    // Define constants for markup percentages
    const res = await fetch('http://localhost:3000/api/markup')
    const markup = await res.json()
    const MetalMarkup = markup.MetalMarkup
    const TypeMarkup = markup.TypeMarkup
    const WeightMarkup = markup.WeightMarkup
    const BrandMarkup = markup.BrandMarkup

    // Function to update the price of a single product
    async function updateProductPrice(productId, price, weight, category) {
      try {
        // Get the product by ID
        var myHeaders = new Headers()
        myHeaders.append('X-auth-token', process.env.ACCESS_TOKEN)

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        }

        const { data: product } = await fetch(
          `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/catalog/products/${productId}`,
          requestOptions,
        )
          .then((response) => response.json())
          .then((result) => {
            return result
          })
          .catch((error) => console.log('error', error))

        // Get the metal markup percentage based on the product name
        let metalMarkup = 0
        for (const metal in metalPrices) {
          if (product.name.toLowerCase().includes(metal.toLowerCase())) {
            metalMarkup = MetalMarkup[metal]
            break
          }
        }

        // Get the type markup percentage based on the product name
        let typeMarkup = 0
        if (product.name.toLowerCase().includes('bar')) {
          typeMarkup = TypeMarkup.Bars
        } else if (product.name.toLowerCase().includes('coin')) {
          typeMarkup = TypeMarkup.Coins
        }

        // Get the weight markup percentage based on the product name
        let weightMarkup = WeightMarkup.Grams
        if (weight >= 1000000) {
          weightMarkup = WeightMarkup.Tonne
        } else if (weight >= 1000) {
          weightMarkup = WeightMarkup.KG
        } else if (weight >= 28.35) {
          weightMarkup = WeightMarkup.Ounce
        }

        // Get the brand markup percentage based on the product name
        let brandMarkup = 0
        if (product.name.toLowerCase().includes('britannia')) {
          brandMarkup = BrandMarkup.Britannia
        } else if (product.name.toLowerCase().includes('maple')) {
          brandMarkup = BrandMarkup.Maple
        } else if (product.name.toLowerCase().includes('krugerrand')) {
          brandMarkup = BrandMarkup.Krugerrand
        } else if (product.name.toLowerCase().includes('sovereign')) {
          brandMarkup = BrandMarkup.Sovereign
        }

        // Calculate the total price of the product
        const markup =
          price *
          weight *
          (1 + (metalMarkup + typeMarkup + weightMarkup + brandMarkup) / 100)
        const totalPrice = markup

        // Update the price field
        if (product) {
          product.price = totalPrice.toFixed(2)
        } else {
          console.log('product not found')
        }

        // Update the product
        myHeaders.append('Content-Type', 'application/json')
        var requestOptions2 = {
          method: 'PUT',
          headers: myHeaders,
          redirect: 'follow',
          body: JSON.stringify(product),
        }

        return await fetch(
          `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/catalog/products/${productId}`,
          requestOptions2,
        )
          .then((response) => response.json())
          .catch((error) => console.log('error', error))
      } catch (error) {
        return res
          .status(500)
          .json({ error: `Error updating product price: ${error}` })
      }
    }

    // Function to update the price of all products
    async function updateAllProductPrices() {
      try {
        var myHeaders = new Headers()
        myHeaders.append('X-auth-token', process.env.ACCESS_TOKEN)

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
          per_page: 300,
        }

        // Get all the products
        const { data: products } = await fetch(
          `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/catalog/products?limit=300`,
          requestOptions,
        )
          .then((response) => response.json())
          .then((result) => {
            return result
          })
          .catch((error) => console.log('error', error))

        // Get Category Spot Prices
        const spotPrice = await fetch(
          `https://api.metalpriceapi.com/v1/latest?api_key=8ff698fd072b23143d22d462f49580bf&base=GBP`,
        )
          .then((response) => response.json())
          .then((data) => {
            return data.rates
          })
          .catch((error) => {
            console.error(error)
          })

        // Loop through each product and update its price
        for (const product of products) {
          const { id: productId, price, weight, name } = product
          for (const metal in metalPrices) {
            if (name.toLowerCase().includes(metal.toLowerCase())) {
              const cat = metalPrices[metal]

              if (product && productId && spotPrice[cat]) {
                console.log(productId, spotPrice[cat])
                await updateProductPrice(
                  productId,
                  1 / spotPrice[cat] / 31.1035,
                  weight,
                  metal,
                )
              }
            }
          }
        }
        console.timeEnd()
        res.status(200).json({
          message: `Updated ${products.length} products.`,
        })
      } catch (error) {
        return res
          .status(500)
          .json({ error: `Error updating category prices: ${error}` })
      }
    }

    // Call the function to update prices of all products in all categories
    if (
      authorization === `Bearer ${process.env.API_SECRET_KEY}` &&
      req.method === 'POST'
    ) {
      updateAllProductPrices()
    } else {
      res.status(401).json({ success: false })
    }
    console.time()
  } catch (error) {
    console.log(`Error updating product prices: ${error}`)
  }
}
