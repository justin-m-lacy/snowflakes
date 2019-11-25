import { Component } from "gibbon.js";
import ZMover from "./zmover";

export default class ZBound extends Component {

	init(){
		this.mover = this.get(ZMover);
	}

	update(){

		if ( this.mover.z >= this.mover.world.zmax ) this.gameObject.Destroy();

	}

}