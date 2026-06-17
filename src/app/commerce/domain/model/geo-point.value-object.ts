export class GeoPoint {
  private _lat: number;
  private _lng: number;

  constructor(props: { lat: number; lng: number }) {
    this._lat = props.lat;
    this._lng = props.lng;
  }

  get lat(): number { return this._lat; }
  set lat(value: number) { this._lat = value; }

  get lng(): number { return this._lng; }
  set lng(value: number) { this._lng = value; }
}
