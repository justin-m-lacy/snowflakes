import { Component } from "gibbon.js";
import ZMover from "./zmover";

export default class ZBound extends Component {

	constructor( mover, newZ ){

		super();

		this.mover = mover;
		if( (typeof newZ) === 'number' ) {
			this.mover.vz = newZ;
		}

	}

	update(){

		if ( this.mover.z >= 11.5 ){

			if ( this.gameObject.group ) this.gameObject.group.remove( this.gameObject, false );
			else if ( this.mover.z >= this.mover.world.zmax ) this.gameObject.Destroy();

		}

	}

}