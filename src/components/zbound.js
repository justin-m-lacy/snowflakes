import { Component } from "gibbon.js";
import ZMover from "./zmover";

export default class ZBound extends Component {

	constructor(mover){
		super();
		this.mover = mover;
	}

	init(){
		if ( !this.mover ) this.mover = this.get(ZMover);
	}

	update(){

		if ( this.mover.z >= 12 ){

			if ( this.gameObject.group ) this.gameObject.group.remove(this.gameObject);
			else if ( this.mover.z >= this.mover.world.zmax ) this.gameObject.Destroy();

		}

	}

}