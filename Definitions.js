
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

const NICEDOORWAYS = {}
Object.entries(DOORWAYS).forEach(element => {
	NICEDOORWAYS[element[1]] = element[0]
});

const rotation = { //Orientation of the door that created this room
	NORTH : 180,
	SOUTH : 0,
	EAST  : 270,
	WEST  : 90
}

const GlobalDirections = {
	 "D" : [rotation.SOUTH],
	 "F" : [rotation.SOUTH, rotation.NORTH],
	 "R" : [rotation.SOUTH, rotation.EAST],
	 "L" : [rotation.SOUTH, rotation.WEST],
	 "LR" : [rotation.SOUTH, rotation.EAST, rotation.WEST],
	 "RF" : [rotation.SOUTH, rotation.EAST, rotation.NORTH],
	 "LF": [rotation.SOUTH, rotation.WEST, rotation.NORTH],
	 "4" : [rotation.SOUTH, rotation.EAST, rotation.WEST, rotation.NORTH]
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
		console.log(this.map)
	}

	getRoom(position){
		return (this.map[position[1]+8][position[0]]) || `undefined`;
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
		this.entered = false
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

	getGlobalExits(){
		let returnValue = [...GlobalDirections[this.blueprint.doorways]]
		returnValue.forEach((element, index, arr) => {
			arr[index] = normalizeDegree(arr[index] + this.rotation)
		});
		return returnValue
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
		let thisRoom = curHouse.getRoom(PLAYER.position)
		switch (input.key) {
			
			case "ArrowUp":
				PLAYER.attemptMovement([0,-1])
				break;
			case "ArrowDown":
				PLAYER.attemptMovement([0,1])
				break;
			case "ArrowLeft":
				PLAYER.attemptMovement([-1,0])
				break;
			case "ArrowRight":
				PLAYER.attemptMovement([1,0])
				break;
			case "Shift":
				console.clear()
				window.location.reload()
				break;
			case " ":
				console.log(thisRoom.getGlobalExits())
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
	},

	dirToRotation : function(dir){
		if (arreq(dir, [0,-1])){
			return rotation.NORTH
		}
		if (arreq(dir, [0,1])){
			return rotation.SOUTH
		}
		if (arreq(dir, [-1,0])){
			return rotation.WEST
		}
		if (arreq(dir, [1,0])){
			return rotation.EAST
		}
	},
	dirToDoorRot : function(dir){
		if (arreq(dir, [0,-1])){
			return rotation.SOUTH
		}
		if (arreq(dir, [0,1])){
			return rotation.NORTH
		}
		if (arreq(dir, [-1,0])){
			return rotation.EAST
		}
		if (arreq(dir, [1,0])){
			return rotation.WEST
		}
	},

	askRoom: function(){
		let options = [rarr(FLOORPLANS), rarr(FLOORPLANS), rarr(FLOORPLANS)]
		let names = [...options]
		names.forEach((element, index)=>{
			names[index] = `${index+1} : ${element.name} (${NICEDOORWAYS[element.doorways]}) - ${element.description || "" }`
		})
		console.log(options)
		
		return options[prompt(names.join("\n"))-1]
	},

	attemptMovement : function(dir) {
		let wishpos = [PLAYER.position[0] + dir[0], PLAYER.position[1] + dir[1]]
		let nextRoom
		try {
			nextRoom = curHouse.getRoom(wishpos)
		} catch (error) {
			return
		}
		
		let thisRoom = curHouse.getRoom(PLAYER.position)
		//  console.log(PLAYER.dirToRotation(dir))
		if (thisRoom.getGlobalExits().includes(PLAYER.dirToRotation(dir))){
			if (nextRoom.blueprint.name == undefined){
				curHouse.createRoom(wishpos, PLAYER.dirToDoorRot(dir), this.askRoom())
			}else if (nextRoom.blueprint.name != undefined &&
				nextRoom.getGlobalExits().includes(PLAYER.dirToDoorRot(dir))
			){
				PLAYER.position = wishpos
				PLAYER.steps -= 1
			}
		}
		
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
		"description" : "1 gem, 1 key, 3 coin",
		"color" : COLOR.BLUE, 
		"rarity" : 0, 
		"cost" : 0, 
		"properties" : {
			paintings : true,
		}, 
		"doorways" : DOORWAYS.DEADEND, 
		"itemProbabilities" : { //[prob, min, max]
			gem : [0.50, 1, 2],
			key : [0.50, 1, 2],
			coin : [0.50, 3, 6],
			chest : [0.10, 0, 1]
		}, 
		"interactables" : [
			{
				type:"NOTE",
				content:"It's swimbird!"
			}
		]
	}),
	passageway :  new BluePrint({
		"name" : "Passageway",
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
		"description" : "Reroll doors",
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
		"description" : "Coin and fruit",
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
		"name" : "commissary",
		"description" : "Spend coin",
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
	$("h2").html( (curHouse.getRoom(PLAYER.position).blueprint.name || "None") + "<br>" +
				  PLAYER.steps)
}

const curHouse = new House({elevatorPosition : [1,1]})
