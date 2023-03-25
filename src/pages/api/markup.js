import fs from 'fs'
import path from 'path'

const markupFilePath = path.join(process.cwd(), 'public', 'markup.json')

export default function handler(req, res) {
  // Read the JSON file
  const markup = JSON.parse(fs.readFileSync(markupFilePath, 'utf-8'))

  // Handle GET requests to retrieve the markup variables
  if (req.method === 'GET') {
    res.status(200).json(markup)
  }

  // Handle POST requests to update the markup variables
  if (req.method === 'POST') {
    const { MetalMarkup, TypeMarkup, WeightMarkup, BrandMarkup } = req.body

    // Update the markup variables
    markup.MetalMarkup = MetalMarkup
    markup.TypeMarkup = TypeMarkup
    markup.WeightMarkup = WeightMarkup
    markup.BrandMarkup = BrandMarkup

    // Write the updated JSON file
    fs.writeFileSync(markupFilePath, JSON.stringify(markup, null, 2))

    res.status(200).json({ message: 'Markup variables updated successfully.' })
  }
}
