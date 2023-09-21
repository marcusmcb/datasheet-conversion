const products = require('./json/updated_DB_test_sheet_FULL.json')
const uniqueMakes = {}
const uniqueYears = {}

const axios = require('axios');

async function getStrapiJWT() {
  const response = await axios.post('http://localhost:1337/auth/local', {
    // identifier: 'marcus.m@icarcover.com', 
    identifier: 'marcus.m@icarcover.com', 
    password: 'Charlie5596!!!!'
  });
  return response.data.jwt;
}


products.forEach((product) => {
	if (!uniqueMakes[product.make_ID]) {
		uniqueMakes[product.make_ID] = product.make
	}
})

const makesData = Object.keys(uniqueMakes).map((id) => ({
	make_ID: id,
	make: uniqueMakes[id],
}))

const generateModelsData = (products) => {
	const uniqueModels = new Set()
	let modelIdCounter = 1
	const modelsData = []
	const modelNameToIdMap = {} // map to store model name to its generated ID
	products.forEach((product) => {
		const model = product.model
		if (!uniqueModels.has(model)) {
			uniqueModels.add(model)
			const model_id = `m${modelIdCounter}`
			modelsData.push({
				model_id,
				model: model,
			})
			modelNameToIdMap[model] = model_id // save the model name and its ID to the map
			modelIdCounter++
		}
	})
	return { modelsData, modelNameToIdMap } // return both the modelsData and the map
}

const generateYearData = (data) => {
	const uniqueYears = new Set()
	let yearIdCounter = 1
	const yearData = []
	data.forEach((item) => {
		const year_generation = item.year_generation
		if (!uniqueYears.has(year_generation)) {
			uniqueYears.add(year_generation)
			yearData.push({
				year_id: `y${yearIdCounter}`,
				year_generation: year_generation,
			})
			yearIdCounter++
		}
	})
	return yearData
}

const extractUniqueSubmodels = (dataArray) => {
	const submodelsMap = {}
	dataArray.forEach((item) => {
		if (item.sub1_id && item.submodel1 && !submodelsMap[item.sub1_id]) {
			submodelsMap[item.sub1_id] = item.submodel1
		}
		if (item.sub2_id && item.submodel2 && !submodelsMap[item.sub2_id]) {
			submodelsMap[item.sub2_id] = item.submodel2
		}
		if (item.sub3_id && item.submodel3 && !submodelsMap[item.sub3_id]) {
			submodelsMap[item.sub3_id] = item.submodel3
		}
	})

	const uniqueSubmodels = []
	for (let submodel_id in submodelsMap) {
		uniqueSubmodels.push({
			submodel_id,
			submodel_name: submodelsMap[submodel_id],
		})
	}

	return uniqueSubmodels
}

const extractProducts = (data, modelNameToIdMap) => {
	// add modelNameToIdMap as a parameter
	return data.map((item) => {
		let submodelIDs = []
		if (item.sub1_id) submodelIDs.push(item.sub1_id)
		if (item.sub2_id) submodelIDs.push(item.sub2_id)
		if (item.sub3_id) submodelIDs.push(item.sub3_id)

		return {
			FK: item.FK,
			type: item.type,
			make_ID: item.make_ID,
			model_id: modelNameToIdMap[item.model], // lookup the model_id using the model name from the map
			year_id: item.year_id,
			submodel_ids: submodelIDs,
			product_title: item.product_title,
			quantity: item.quantity,
			price: item.price,
			sale_price: item.sale_price,
			htmlcontent: item.html_content,
		}
	})
}

const { modelsData, modelNameToIdMap } = generateModelsData(products) // destructuring
const productArray = extractProducts(products, modelNameToIdMap)

const parseProductImages = (productData) => {
	const imageTypes = [
		{ prefix: 'uc_image', type: 'category' },
		{ prefix: 'bannerimage', type: 'banner' },
		{ prefix: 'bannerimage_m', type: 'banner_mobile' },
		{ prefix: 'feature_', type: 'feature' },
		{ prefix: 'product_', type: 'product' },
	]

	let productImages = []
	let imageId = 0

	imageTypes.forEach((imgType) => {
		const keys = Object.keys(productData).filter((key) =>
			key.startsWith(imgType.prefix)
		)

		keys.forEach((key) => {
			const urls = Array.isArray(productData[key])
				? productData[key]
				: productData[key].split(',')

			urls.forEach((url) => {
				if (url) {
					const fileName = url.split('/').pop()

					productImages.push({
						image_id: imageId++,
						FK: productData.FK,
						image_type: imgType.type,
						file_name: fileName,
						image_link: url,
					})
				}
			})
		})
	})

	return productImages
}

const allProductImages = []

products.forEach((product) => {
	const productImages = parseProductImages(product)
	allProductImages.push(...productImages)
})

const extractProductCharacteristics = (products) => {
	return products.map((product) => {
		return {
			characteristic_id: product.FK,
			FK: product.FK,
			weatherproof: product.weatherproof,
			scratchproof: product.scratchproof,
			uv_heat_protection: product.uv_heat_protection,
			damp_protection: product.damp_protection,
			hail_storm_and_snow_protection: product.hail_storm_and_snow_protection,
			dust_and_abrasion_protection: product.dust_and_abrasion_protection,
			mirror: product.mirror,
			size: product.size,
			characteristics_code: product.characteristics_code,
		}
	})
}

const productCharacteristicsArray = extractProductCharacteristics(products)

// console.log(makesData[0])
// console.log(modelsData[0])
// console.log(generateYearData(products)[0])
// console.log(extractUniqueSubmodels(products)[0])
// console.log(productArray[0])
// console.log(allProductImages[0])
// console.log(productCharacteristicsArray[0])

async function sendMakesToStrapi(makesData) {
  const jwtToken = await getStrapiJWT();

  const headers = {
    'Authorization': `Bearer ${jwtToken}`
  };

  for (const make of makesData) {
    await axios.post('http://localhost:1337/makes', make, {
      headers: headers
    });
  }
}

sendMakesToStrapi(makesData).then(() => {
  console.log('Makes data sent to Strapi.');
}).catch(error => {
  console.error('Error sending data to Strapi:', error);
});


