const products = require('./json/updated_DB_test_sheet_FULL.json')

console.log('PRODUCT KEYS: ')
console.log(Object.keys(products[0]))

const uniqueMakes = {}
const uniqueYears = {}

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

const extractProducts = (data, modelNameToIdMap) => {  // add modelNameToIdMap as a parameter
	return data.map((item) => {
		let submodelIDs = [];
		if (item.sub1_id) submodelIDs.push(item.sub1_id);
		if (item.sub2_id) submodelIDs.push(item.sub2_id);
		if (item.sub3_id) submodelIDs.push(item.sub3_id);

		return {
			FK: item.FK,
			type: item.type,
			make_ID: item.make_ID,
			model_id: modelNameToIdMap[item.model],  // lookup the model_id using the model name from the map
			year_id: item.year_id,
			submodel_ids: submodelIDs,
			product_title: item.product_title,
			quantity: item.quantity,
			price: item.price,
			sale_price: item.sale_price,
			htmlcontent: item.html_content,
		};
	});
}


console.log(makesData)
const { modelsData, modelNameToIdMap } = generateModelsData(products);  // destructuring
console.log(modelsData);

console.log(generateYearData(products))
console.log(extractUniqueSubmodels(products))

const productArray = extractProducts(products, modelNameToIdMap);
console.log(productArray);

