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
	products.forEach((product) => {
		const model = product.model
		if (!uniqueModels.has(model)) {
			uniqueModels.add(model)
			modelsData.push({
				model_id: `m${modelIdCounter}`,
				model: model,
			})
			modelIdCounter++
		}
	})
	return modelsData
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

function extractUniqueSubmodels(dataArray) {
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

console.log(makesData)
console.log(generateModelsData(products))
console.log(generateYearData(products))
console.log(extractUniqueSubmodels(products))
