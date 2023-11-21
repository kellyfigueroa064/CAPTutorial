using { cuid, managed } from '@sap/cds/common';

namespace toDo.List;

entity Tasks : cuid, managed {
    responsible : String(255);
    description : String(255);
    date : String;
    limitDate : String;
    status: String;
}