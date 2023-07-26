type Ids = {
  ids: string[];
};

export interface TAGCurl<ADD, UPDATE> {
  getAll();
  update(t: UPDATE);
  del(ids: Ids);
  add(t: ADD);
}
