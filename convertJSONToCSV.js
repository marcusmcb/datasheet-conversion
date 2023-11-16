const fs = require('fs')

// Load JSON data
const jsonData = require('./master_product_sheet_updated_suv_and_trucks.json')

// Extract headers (keys of the first object)
const headers = Object.keys(jsonData[0])
const csvRows = []

// Add header row
csvRows.push(headers.join(','))

// Convert each JSON object to a CSV row
jsonData.forEach((item) => {
	const row = headers
		.map((header) => {
			let value = item[header] || ''
			// Handle values that contain commas or newlines
			if (value.includes(',') || value.includes('\n')) {
				value = `"${value.replace(/"/g, '""')}"` // Escape double quotes and wrap in quotes
			}
			return value
		})
		.join(',')

	csvRows.push(row)
})

// Combine all rows into a single string
const csvString = csvRows.join('\n')

// Save to a CSV file
fs.writeFile('master_product_sheet_suv_and_trucks.csv', csvString, (err) => {
	if (err) {
		console.error('Error writing CSV file', err)
	} else {
		console.log('CSV file successfully created')
	}
})
