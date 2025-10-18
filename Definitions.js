
const DOORWAYS = {
	 DEADEND : "D",
	 FORWARD : "F",
	 RIGHT : "R",
	 LEFT : "L",
	 LEFTRIGHT : "LR",
	 RIGHTFOWARD : "RF",
	 LEFTFORWARD : "LF",
	 FOURWAY : "4"
}
const COLOR = {
	BLUE : "blue",
	RED : "red",
	GREEN : "green",
	Bedroom : "purple", 
	STORE : "gold",
	HALLWAY : "brown",
	WHITE : "white",
	BLACK : "black"
}

const rotation = {
	NORTH : 180,
	SOUTH : 0,
	EAST  : -90,
	WEST  : 90
}

class House {
	constructor(parameters) {
		
		let {elevatorPosition} = parameters
		this.width = 5
		this.height = 9
		this.map = []
		for (let curRank = 0; curRank < this.height; curRank++) {
			// let rank = map[curRank];
			this.map[curRank] = []
			for (let curCollumn = 0; curCollumn < this.width; curCollumn++) {
				let roomProperties = {
					position : [curCollumn, curRank],
					rotation : 0,
					blueprint : "None"
				}

				if (curRank == 0 && curCollumn == 3-1){
					roomProperties.blueprint = startingRoom
				}

				this.map[curRank][curCollumn] = new Room(roomProperties)//`[${curCollumn+1}, ${curRank+1}]`
			}
		}
		this.map.reverse()
	}

	getRoom(position){
		return (this.map[position[1]+8][position[0]]) || `undefined (${position})`;
	}
	
	createRoom(position, rotation, blueprint){
		 this.map[position[1]+8][position[0]] = new Room({position:position, rotation:rotation, blueprint:blueprint})
	}
}

class BluePrint {

	static floorplans = [];

    constructor(parameters) {
        let requiredParameters = ["name", "color", "rarity", "cost", "properties", "doorways", "itemProbabilities", "interactables"]
		requiredParameters.forEach(element => {
			if (!Object.keys(parameters).includes(element)) {
				console.error("BluePrint parameters doesn't include " + element);
			}
		});
		for (const [key, value] of Object.entries(parameters)) {
 			this[key] = value
		}
		BluePrint.floorplans.push(this)
    }

	toString(){
		return this.name
	}
}

class Room {
    constructor(parameters) {
        this.position = parameters.position
        this.rotation = parameters.rotation
        this.blueprint = parameters.blueprint
    }

	toString(){
		let actualImage = this.blueprint.doorways
		let flipper = ""
		let realRotation = this.rotation
		if (actualImage == "R") {
			actualImage = "L"
			flipper = "flipped"
		}

		return `<img ${(curHouse.getRoom(PLAYER.position).position == this.position)?'selected':''} ${flipper} style="background-color:${this.blueprint.color};rotate:${this.rotation}deg;" src="Directions/${(actualImage || `none`)}.png">`
	}
}

const PLAYER = {
	position : [2,0],
	steps : 40,
	keys : 0,
	gems : 0,
	coins : 0,
	curses : [],
	blessings : [],
	expirements : [],
	items : [],

	onInput : function (input) {
		// alert(input.key)
		let nextRoom
		switch (input.key) {
			
			case "ArrowUp":
				nextRoom = curHouse.getRoom([PLAYER.position[0], PLAYER.position[1]-1])
				if (nextRoom.blueprint.name == undefined){
					curHouse.createRoom([PLAYER.position[0], PLAYER.position[1]-1], 0, Object.values(FLOORPLANS)[randomIntFromInterval(0, Object.values(FLOORPLANS).length-1)])
				}else{
					PLAYER.position[1]--
				}
				break;
			case "ArrowDown":
				nextRoom = curHouse.getRoom([PLAYER.position[0], PLAYER.position[1]+1])
				if (nextRoom.blueprint.name == undefined){
					curHouse.createRoom([PLAYER.position[0], PLAYER.position[1]+1], 180, Object.values(FLOORPLANS)[randomIntFromInterval(0, Object.values(FLOORPLANS).length-1)])
				}else{
					PLAYER.position[1]++
				}
				
				
				break;
			case "ArrowLeft":
				nextRoom = curHouse.getRoom([PLAYER.position[0]-1, PLAYER.position[1]])
				if (nextRoom.blueprint.name == undefined){
					curHouse.createRoom([PLAYER.position[0]-1, PLAYER.position[1]], -90, Object.values(FLOORPLANS)[randomIntFromInterval(0, Object.values(FLOORPLANS).length-1)])
				}else{
					PLAYER.position[0]--
				}
				
				break;
			case "ArrowRight":
				nextRoom = curHouse.getRoom([PLAYER.position[0]+1, PLAYER.position[1]])
				if (nextRoom.blueprint.name == undefined){
					curHouse.createRoom([PLAYER.position[0]+1, PLAYER.position[1]], 90, Object.values(FLOORPLANS)[randomIntFromInterval(0, Object.values(FLOORPLANS).length-1)])
				}else{
					PLAYER.position[0]++
				}
				
				break;
			default:
				// alert(curHouse.getRoom(PLAYER.position).blueprint)
				// curHouse.map[8+PLAYER.position[1]][PLAYER.position[0]] = new Room({position:[PLAYER.position[0],PLAYER.position[1]], rotation:0,blueprint:new BluePrint({
				// 	"name" : "Built",
				// 	"color" : COLOR.WHITE, 
				// 	"rarity" : -1, 
				// 	"cost" : -1, 
				// 	"properties" : {}, 
				// 	"doorways" : "4", 
				// 	"itemProbabilities" : {}, 
				// 	"interactables" : []
				// })})
			
				break;
		}

		refresh()
	}
}

const startingRoom = new BluePrint({
	"name" : "Starting Room",
	"color" : COLOR.BLUE, 
	"rarity" : -1, 
	"cost" : -1, 
	"properties" : {
		paintings : true,
	}, 
	"doorways" : DOORWAYS.FOURWAY, 
	"itemProbabilities" : {}, 
	"interactables" : [{
		type : "NOTE",
		content : "Welcome!"
	}]
});

const FLOORPLANS = {
	hallway :  new BluePrint({
		"name" : "Hallway",
		"color" : COLOR.HALLWAY, 
		"rarity" : 0, 
		"cost" : 0, 
		"properties" : {
			paintings : true,
		}, 
		"doorways" : DOORWAYS.FORWARD, 
		"itemProbabilities" : {}, 
		"interactables" : []
	}),
	storeRoom :  new BluePrint({
		"name" : "Storeroom",
		"color" : COLOR.BLUE, 
		"rarity" : 0, 
		"cost" : 0, 
		"properties" : {
			paintings : true,
		}, 
		"doorways" : DOORWAYS.DEADEND, 
		"itemProbabilities" : { //[prob, min, max]
			gem : [1.00, 1, 1],
			key : [1.00, 1, 1],
			coin : [1.00, 3, 6]
		}, 
		"interactables" : [
			{
				type:"NOTE",
				content:"It's swimbird!"
			}
		]
	}),
	passageway :  new BluePrint({
		"name" : "passageway",
		"color" : COLOR.BROWN, 
		"rarity" : 0, 
		"cost" : 2, 
		"properties" : {
			paintings : true,
		}, 
		"doorways" : DOORWAYS.FOURWAY, 
		"itemProbabilities" : { 
		}, 
		"interactables" : [
		]
	}),
	drawingRoom :  new BluePrint({
		"name" : "Drawing Room",
		"color" : COLOR.BLUE, 
		"rarity" : 1, 
		"cost" : 2, 
		"properties" : {
			paintings : true,
		}, 
		"doorways" : DOORWAYS.LEFTRIGHT, 
		"itemProbabilities" : {}, 
		"interactables" : []
	}),
	pantry :  new BluePrint({
		"name" : "Pantry",
		"color" : COLOR.BLUE, 
		"rarity" : 0, 
		"cost" : 0, 
		"properties" : {
			paintings : true,
		}, 
		"doorways" : DOORWAYS.LEFT, 
		"itemProbabilities" : {}, 
		"interactables" : []
	}),
	commisary :  new BluePrint({
		"name" : "Commisary",
		"color" : COLOR.STORE, 
		"rarity" : 0, 
		"cost" : 1, 
		"properties" : {
			paintings : true,
		}, 
		"doorways" : DOORWAYS.RIGHT, 
		"itemProbabilities" : {}, 
		"interactables" : []
	}),
	
}

$("body").on("keyup", PLAYER.onInput)

function refresh(){
	$("div").html(curHouse.map.join("<br>").replaceAll(",",""))
	$("p").html(curHouse.getRoom(PLAYER.position).toString())
	$("h2").html(curHouse.getRoom(PLAYER.position).blueprint.name || "None")
}

const curHouse = new House({elevatorPosition : [1,1]})
