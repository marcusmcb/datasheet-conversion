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

csvToJson('./data/master_product_sheet_111623.csv', './master_product_sheet_111623.json')
// csvToJson('./data/default_image_update/default_model_image_set_TRUCK.csv', './json/default_model_image_set_TRUCK.json')
