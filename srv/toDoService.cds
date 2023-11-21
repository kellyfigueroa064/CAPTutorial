using { toDo.List as db } from '../db/schema';

service List {
    entity Task as projection on db.Tasks;
}