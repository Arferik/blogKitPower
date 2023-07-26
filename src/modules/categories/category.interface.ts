type Ids = {
  ids: string[];
};

export interface CategoryCurl<ADD, UPDATE> {
  getAll();
  update(t: UPDATE);
  del(ids: Ids);
  add(t: ADD);
}
