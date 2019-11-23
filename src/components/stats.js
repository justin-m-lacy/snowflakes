import { Component } from "gibbon.js";

/**
 * Stats to share a values across multiple components/objects.
 */
export default class Stats extends Component {

	get count() { return this._count;}
	set count(v) { this._count = v; }

	init(){
		this._count = 0;
	}

}