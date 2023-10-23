const fs = require('fs')
const Papa = require('papaparse')

const csvToJson = (filePath, outputFilePath) => {
	const fileContent = fs.readFileSync(filePath, 'utf8')

	Papa.parse(fileContent, {
		header: true,
		complete: (result) => {
			fs.writeFileSync(outputFilePath, JSON.stringify(result.data, null, 2))
			console.log(`Data saved to ${outputFilePath}`)
		},
	})
}

csvToJson('./data/product_csv_files/final_website_db_20231004_ALL_PRODUCTS.csv', './json/final_product_data.json')
