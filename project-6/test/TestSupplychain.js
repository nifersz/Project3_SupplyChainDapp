// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.utils.toWei("1", "ether")

    // Item States
    const harvestedState = 0
    const processedState = 1
    const packedState = 2
    const forSaleState = 3
    const soldState = 4
    const shippedState = 5
    const receivedState = 6
    const purchasedState = 7
    // Buffer One Data Indexes
    const b1SKUIndex = 0
    const b1UPCIndex = 1
    const b1OwnerIdIndex = 2
    const b1FarmerIdIndex = 3
    const b1FarmNameIndex = 4
    const b1FarmInfoIndex = 5
    const b1FarmLatIndex = 6
    const b1FarmLongIndex = 7
    // Buffer Two Data Indexes
    const b2SKUIndex = 0
    const b2UPCIndex = 1
    const b2ProductIdIndex = 2
    const b2ProductNotesIndex = 3
    const b2ProductPriceIndex = 4
    const b2ItemStateIndex = 5
    const b2DistributorIdIndex = 6
    const b2RetailerIdIndex = 7
    const b2ConsumerIdIndex = 8
    
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        var harvestedEventEmitted = false
        await supplyChain.addFarmer(originFarmerID)        
        await supplyChain.contract.events.Harvested((err, res) => {
            harvestedEventEmitted = true // Watch the emitted event Harvested()
        })

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestItem(
            upc, 
            originFarmerID, 
            originFarmName, 
            originFarmInformation, 
            originFarmLatitude, 
            originFarmLongitude, 
            productNotes,
            {from: originFarmerID}
        )

        // Retrieve the just now saved item from blockchain by calling function fetchItem...()
        const bufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const bufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        assert.equal(bufferOne[b1SKUIndex], sku, 'Error: Invalid item SKU')
        assert.equal(bufferOne[b1UPCIndex], upc, 'Error: Invalid item UPC')
        assert.equal(bufferOne[b1OwnerIdIndex], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(bufferOne[b1FarmerIdIndex], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(bufferOne[b1FarmNameIndex], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(bufferOne[b1FarmInfoIndex], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(bufferOne[b1FarmLatIndex], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(bufferOne[b1FarmLongIndex], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(bufferTwo[b2ItemStateIndex], harvestedState, 'Error: Invalid item State')
        assert.equal(harvestedEventEmitted, true, 'Invalid event emitted')
    })

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        var processedEventEmitted = false        
        await supplyChain.contract.events.Processed((err, res) => {
            processedEventEmitted = true // Watch the emitted event Processed()
        })

        // Mark an item as Processed by calling function processtItem()
        await supplyChain.processItem(upc, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem...()
        const bufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        assert.equal(bufferTwo[b2ItemStateIndex], processedState, 'Error: Invalid item State')
        assert.equal(processedEventEmitted, true, 'Invalid event emitted')
    })

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        var packedEventEmitted = false
        await supplyChain.contract.events.Packed((err, res) => {
            packedEventEmitted = true // Watch the emitted event Packed()
        })

        // Mark an item as Packed by calling function packItem()
        await supplyChain.packItem(upc, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem...()
        const bufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        assert.equal(bufferTwo[b2ItemStateIndex], packedState, 'Error: Invalid item State')
        assert.equal(packedEventEmitted, true, "Invalid event emitted")
    })

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        var forSaleEventEmitted = false
        await supplyChain.contract.events.ForSale((err, res) => {
            forSaleEventEmitted = true // Watch the emitted event ForSale()
        })

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.sellItem(upc, productPrice, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem...()
        const bufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        assert.equal(bufferTwo[b2ProductPriceIndex], productPrice, 'Error: Invalid product price')
        assert.equal(bufferTwo[b2ItemStateIndex], forSaleState, 'Error: Invalid item State')
        assert.equal(forSaleEventEmitted, true, "Invalid event emitted")
    })

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        const buyWithThisMoney = web3.utils.toWei("3", "ether")
        var soldEventEmitted = false
        await supplyChain.addDistributor(distributorID)        
        await supplyChain.contract.events.Sold((err, res) => {
            soldEventEmitted = true // Watch the emitted event Sold()
        })

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.buyItem(upc, {from: distributorID, value: buyWithThisMoney})

        // Retrieve the just now saved item from blockchain by calling function fetchItem...()
        const bufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const bufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        assert.equal(bufferOne[b1OwnerIdIndex], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(bufferTwo[b2DistributorIdIndex], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(bufferTwo[b2ItemStateIndex], soldState, 'Error: Invalid item State')
        assert.equal(soldEventEmitted, true, "Invalid event emitted")
    })

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        var shippedEventEmitted = false
        await supplyChain.contract.events.Shipped((err, res) => {
            shippedEventEmitted = true // Watch the emitted event Shipped()
        })

        // Mark an item as Shipped by calling function shipItem()
        await supplyChain.shipItem(upc, {from: distributorID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem...()
        const bufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        assert.equal(bufferTwo[b2ItemStateIndex], shippedState, 'Error: Invalid item State')
        assert.equal(shippedEventEmitted, true, "Invalid event emitted")
    })

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()
        var receivedEventEmitted = false
        await supplyChain.addRetailer(retailerID)
        await supplyChain.contract.events.Received((err, res) => {
            receivedEventEmitted = true // Watch the emitted event Received()
        })
        
        // Mark an item as Received by calling function receiveItem()
        await supplyChain.receiveItem(upc, {from: retailerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem...()
        const bufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const bufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        assert.equal(bufferOne[b1OwnerIdIndex], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(bufferTwo[b2RetailerIdIndex], retailerID, 'Error: Missing or Invalid retailerID')
        assert.equal(bufferTwo[b2ItemStateIndex], receivedState, 'Error: Invalid item State')
        assert.equal(receivedEventEmitted, true, "Invalid event emitted")
    })

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        var purchasedEventEmitted = false
        await supplyChain.addConsumer(consumerID)
        await supplyChain.contract.events.Purchased((err, res) => {
            purchasedEventEmitted = true // Watch the emitted event Purchased()
        })

        // Mark an item as Purchased by calling function purchaseItem()
        await supplyChain.purchaseItem(upc, {from: consumerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem...()
        const bufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const bufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        assert.equal(bufferOne[b1OwnerIdIndex], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(bufferTwo[b2ConsumerIdIndex], consumerID, 'Error: Missing or Invalid consumerID')
        assert.equal(bufferTwo[b2ItemStateIndex], purchasedState, 'Error: Invalid item State')
        assert.equal(purchasedEventEmitted, true, "Invalid event emitted")
    })

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItemBufferOne()
        const bufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        
        // Verify the result set:
        assert.equal(bufferOne[b1SKUIndex], sku, 'Error: Invalid item SKU')
        assert.equal(bufferOne[b1UPCIndex], upc, 'Error: Invalid item UPC')
        assert.equal(bufferOne[b1OwnerIdIndex], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(bufferOne[b1FarmerIdIndex], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(bufferOne[b1FarmNameIndex], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(bufferOne[b1FarmInfoIndex], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(bufferOne[b1FarmLatIndex], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(bufferOne[b1FarmLongIndex], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItemBufferTwo()
        bufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set:
        assert.equal(bufferTwo[b2SKUIndex], sku, 'Error: Invalid item SKU')
        assert.equal(bufferTwo[b2UPCIndex], upc, 'Error: Invalid item UPC')
        assert.equal(bufferTwo[b2ProductIdIndex], productID, 'Error: Invalid item Product ID')
        assert.equal(bufferTwo[b2ProductNotesIndex], productNotes, 'Error: Invalid item Product Notes')
        assert.equal(bufferTwo[b2ProductPriceIndex], productPrice, 'Error: Invalid item Product Price')
        assert.equal(bufferTwo[b2ItemStateIndex], purchasedState, 'Error: Invalid item State')
        assert.equal(bufferTwo[b2DistributorIdIndex], distributorID, 'Error: Invalid distributor ID')
        assert.equal(bufferTwo[b2RetailerIdIndex], retailerID, 'Error: Invalid retailer ID')
        assert.equal(bufferTwo[b2ConsumerIdIndex], consumerID, 'Error: Invalid consumer ID')
    })

});
