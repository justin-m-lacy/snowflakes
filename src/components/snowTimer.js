import { Component } from "gibbon.js";
import ZMover from "./zmover";
import ZBound from "./zbound";


export default class SnowTimer extends Component {

	/**
	 *
	 * @param {number} maxFrames - frames before fade out.
	 */
	constructor( maxFrames=600){

		super();
		this.timer = maxFrames;

	}

	update(){


		if ( --this.timer < 0 ) {

			let mv = this.get(ZMover);
			if ( !mv ) this.gameObject.Destroy();
			else {

				mv.vz = Math.max( mv.vz, 0.25 + 0.25*Math.random() );
				if ( this.gameObject.group) this.gameObject.group.remove(this.gameObject);
				this.Destroy();

			}

		}

	}

}