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

// csvToJson('./data/NEW_master_product_sheet/master_product_sheet_112823.csv', './master_product_sheet_112823.json')
// csvToJson('./data/master_product_sheet_120123.csv', './master_product_sheet_120123.json')
// csvToJson('./data/TO_TEST_master_product_sheet_121423.csv', './master_product_sheet_121423.json')
// csvToJson('./data/review_sheet_test.csv', './review_sheet_test.json')
csvToJson('./data/review_sheet_122023.csv', './review_sheet_122023.json')
// csvToJson('./data/default_image_update/default_model_image_set_TRUCK.csv', './json/default_model_image_set_TRUCK.json')
