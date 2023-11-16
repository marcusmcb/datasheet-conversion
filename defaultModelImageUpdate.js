const fs = require('fs')

// Read JSON data
const masterProductSheet = require('./json/master_product_sheet_updated_suv.json') // Updated path
const defaultModelImageSetSUV = require('./json/default_model_image_set_TRUCK.json')

// Create a mapping for SUV default model images
const defaultSUVImagesMap = new Map()
defaultModelImageSetSUV.forEach((item) => {
	const key = item.make + '-' + item.model
	defaultSUVImagesMap.set(key, item.default_model_images)
})

// Update master product sheet for SUV models
masterProductSheet.forEach((item) => {
	if (!item.default_model_images) {
		// Check if default_model_images is empty
		const key = item.make + '-' + item.model
		if (defaultSUVImagesMap.has(key)) {
			item.default_model_images = defaultSUVImagesMap.get(key)
		}
	}
})

// Save updated JSON
fs.writeFile(
	'master_product_sheet_updated_suv_and_trucks.json',
	JSON.stringify(masterProductSheet, null, 2),
	(err) => {
		if (err) {
			console.error('Error writing file', err)
		} else {
			console.log('Successfully wrote updated SUV file')
		}
	}
)
