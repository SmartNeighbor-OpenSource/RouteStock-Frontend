export class SearchFilter {
  private _query: string;
  private _category: string | null;

  constructor(props: { query: string; category?: string | null }) {
    this._query    = props.query;
    this._category = props.category ?? null;
  }

  get query(): string { return this._query; }
  set query(value: string) { this._query = value; }

  get category(): string | null { return this._category; }
  set category(value: string | null) { this._category = value; }

  isEmpty(): boolean { return this._query.trim().length === 0 && !this._category; }
}
