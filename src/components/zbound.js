import { Component } from "gibbon.js";

export default class ZBound extends Component {

	constructor(mover){
		super();
		this.mover = mover;
	}

	update(){

		if ( this.mover.z >= this.mover.world.zmax ) this.gameObject.Destroy();

	}

}