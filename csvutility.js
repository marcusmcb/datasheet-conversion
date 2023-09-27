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

// csvToJson('./data/updated_DB_test_sheet_mini.csv', './json/mini_data_set.json')
csvToJson('./data/updated_DB_test_sheet_FULL.csv', './json/test_data_sheet_cleaned.json')
