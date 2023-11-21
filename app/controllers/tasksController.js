const HOST = window.location.host;

/*Consulta la lista de tareas*/
const loadData = async () => {
    tasksFilter('');
    modalFunction();
};

/* ACCIONES */

/*const responsibleHeader = document.getElementById('responsibleHeader')
responsibleHeader.addEventListener('click', () => {tasksFilter('responsible');});

const dateHeader = document.getElementById('dateHeader')
dateHeader.addEventListener('click', () => {tasksFilter('date');});

const limitDateHeader = document.getElementById('limitDateHeader')
limitDateHeader.addEventListener('click', () => {tasksFilter('limitDate');});

const statusHeader = document.getElementById('statusHeader')
statusHeader.addEventListener('click', () => {tasksFilter('status');});*/

/* Funcion de filtrado de informacion de data, solo funciona en search :(  */

const tasksFilter = async (value, busq) => {

    const callback = (result) => {
        console.log("userFilter res: ", result);
        setDataInTable(result.value);
    }
        switch (value? value: "") {
            case "responsible":
                $.get(`https://${HOST}/odata/v4/list/Task?$orderby=${responsible.trim}`,callback);
                break;

            case "Search":
                $.get(`https://${HOST}/odata/v4/list/Task?$search=${busq.trim()}`,callback);
                break;
        
            case "date":
                $.get(`https://${HOST}/odata/v4/list/Task?$orderby=${date}`,callback);
                break;

            case "limitDate":
                $.get(`https://${HOST}/odata/v4/list/Task?$orderby=${limitDate}`,callback);
                break;

            case "estatus":
                $.get(`https://${HOST}/odata/v4/list/Task?$orderby=${estatus}`,callback);
                break;

            default:
                $.get(`https://${HOST}/odata/v4/list/Task`,callback);
                break;
        }
};

const callbackData = (result) => {
    setDataInTable(result.value);
}

/* Llamada previa carga de la pagina */
window.addEventListener("load", loadData);

/* Funcion para abrir el modal */
const setSelection = async (selection, method) => {
    try{
        let selectionTrimmed = selection.trim();
        switch (method) {
            case "Edit":
                document.getElementById("titleModal").innerHTML = "Editar tarea";
                document.getElementById("btnSubmit").innerHTML = "Guardar";
                response = await fetch(`https://${HOST}/odata/v4/list/Task/${selectionTrimmed}`);
                result = await response.json();
                setDataModal(result);
                editTask(result);
                break;
        
            default:
                //Crear
                document.getElementById("titleModal").innerHTML = "Crear tarea";
                document.getElementById("btnSubmit").innerHTML = "Guardar";
                modalFunction();
                break;
        }
    }catch(error){
        alert(`Service Error: ${error}`);
    }
    
}

/* ============= Funciones del modal ================= */

/* Funcion para minimizar el modal */

const cerrarModal = () => {
    let span = document.getElementsByClassName("close")[0];
    span.click();
};

const modalFunction = () => {
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the button that opens the modal
    var btn = document.getElementById("crear");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on the button, open the modal
    btn.onclick = function() {
    modal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }
};

/* Presetear data del modal */

const setDataModal = (res) => {
    //console.log("res = ",res);
    //selecciono elementos
    let responsibleModal = document.getElementById("responsable");
    let descriptionModal = document.getElementById("descripcion");
    let dateModal = document.getElementById("fechaInicio");
    //transformo fecha para que la tome el input date
    fechaStr = res.date;
    let partesFecha = fechaStr.split("/"); // Divide la fecha en [ '23', '02', '2023' ]
    let fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`; // Une las partes en el formato "yyyy-mm-dd"
    //transformo fecha limite para que la tome el input date
    let dateLimitModal = document.getElementById("fechaLimite");
    fechaStrLimit = res.limitDate;
    let partesFechaLimit = fechaStrLimit.split("/"); // Divide la fecha en [ '23', '02', '2023' ]
    let fechaFormateadaLimit = `${partesFechaLimit[2]}-${partesFechaLimit[1]}-${partesFechaLimit[0]}`; // Une las partes en el formato "yyyy-mm-dd"
    let statusModal = document.getElementById("estatus");

    //asigno valores
    responsibleModal.value = res.responsible;
    descriptionModal.value = res.description;
    dateModal.value = fechaFormateada;
    dateLimitModal.value = fechaFormateadaLimit;
    statusModal.value = res.status;
};

/* Funcion para mostrar el modal y activar sus funcionalidades */

const editTask = (data) => {
    //console.log("en editTask data = ",data);
    modalFunction();
    // Get the modal
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
};

/* ======== Acciones del CRUD ========= */
 /* Crear tarea */

const crearTask = () => {
    console.log("crearTask");
    if( !formValidation() ){
        return;
    }
    //selecciono elementos
    let responsible = document.getElementById("responsable").value;
    let description = document.getElementById("descripcion").value;
    let date = document.getElementById("fechaInicio").value;
    let partesFecha = date.split("-");
    let fechaFormato = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
    let dateLimit = document.getElementById("fechaLimite").value;
    let partesFechaLimit = dateLimit.split("-");
    let fechaFormatoLimit = `${partesFechaLimit[2]}/${partesFechaLimit[1]}/${partesFechaLimit[0]}`;
    let status = document.getElementById("estatus").value;

    // objeto
    let payload = {
        "responsible": responsible,
        "description": description,
        "date": fechaFormato,
        "limitDate": fechaFormatoLimit,
        "status": status
        }
    
    //consumo servicio 
        requestJSON("POST", payload, (result) => {
            cerrarModal();
            setDataInTable(result);
            location.reload();
        });

};

/* Actualizar tarea */

const actualizarTask = () => {
    //console.log("console titleModal = ",document.getElementById("titleModal").innerHTML);
    if(document.getElementById("titleModal").innerHTML === "Crear tarea"){
        crearTask();
        return;
    }
    //console.log("entro en actualizarTask");
    //selecciono elementos
    let responsible = document.getElementById("responsable").value;
    let description = document.getElementById("descripcion").value;
    let date = document.getElementById("fechaInicio").value;
    //transformo fecha para que la tome el input date
    let partesFecha = date.split("-");
    let fechaFormato = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
    //transformo fecha limite para que la tome el input date
    let dateLimit = document.getElementById("fechaLimite").value;
    let partesFechaLimit = dateLimit.split("-");
    let fechaFormatoLimit = `${partesFechaLimit[2]}/${partesFechaLimit[1]}/${partesFechaLimit[0]}`;

    let status = document.getElementById("estatus").value;
    let id = document.getElementById("code").innerHTML;
    //console.log("id = ",id);

    // objeto
    let payload = {
        "ID": id,
        "responsible": responsible,
        "description": description,
        "date": fechaFormato,
        "limitDate": fechaFormatoLimit,
        "status": status
        };
    //console.log('payload' , payload);
    
    //consumo servicio 
        requestJSON("PATCH", payload, (result) => {
            //console.log("Success 2 - ",result);
            cerrarModal();
            setDataInTable(result);
            location.reload();
        });

};

/* Eliminar tarea */

const eliminarTask = (id, method, description, responsible) => {
    let msg = `Está seguro de eliminar la tarea " ${description} " cuyo responsable es ${responsible} ? `;
    if (confirm(msg)) {
        requestJSON(method, {"ID" : id}, (result) => {
            alert("Tarea eliminada con éxito!");
            setDataInTable(result);
            location.reload();
        });
    }
};

/* Funcion que ejecuta la llamada al servicio del crud */

const requestJSON = async (method, payload, callback) => {
    
    console.log("requestJSON con method = ",method," y payload = ",payload);
    let endpoint = `https://${HOST}/odata/v4/list/Task`;
    let url;
    switch (method) {
        case "PATCH":
            url = `${endpoint}/${payload.ID}`;
            break;

        case "DELETE":
            url = `${endpoint}/${payload.ID}`;
            break;

        case "POST":
            url = endpoint;
            break;

        default:
            url = endpoint;
            break;
    }
    try{
        let response;
            response = await fetch(`${url}`, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });
        result = await response.json();
        console.log("Callback Success = ",result);
        callback(result);
    }catch(e){
        console.log("RequestJSON error = ", e);
        callback({"Error" : "Falla de servicio"});
    }
};

/* Funcion para listar los registros de tareas en la tabla */

const setDataInTable = (data) => {
    console.log("setDataInTable:", data);
    let item = '<tr>'+
                '<td style="display:none;" id="code">{{code}}</td>'+
                '<td>{{ID}}</td>'+
                '<td>{{responsible}}</td>'+
                '<td>{{description}}</td>'+
                '<td>{{date}}</td>'+
                '<td>{{limitDate}}</td>'+
                '<td>{{status}}</td>'+
                '<td>'+
                    // '<a href="#" class="view" title="View" data-toggle="tooltip"><i class="material-icons">&#xE417;</i></a>'+
                    '<a href="#" class="edit" title="Edit" data-toggle="tooltip" onclick="setSelection(\'{{code}}\',\'Edit\')"><i class="material-icons">&#xE254;</i></a>'+
                    '<a href="#" class="delete" title="Delete" data-toggle="tooltip" onclick="eliminarTask(\'{{code}}\',\'DELETE\',\'{{description}}\',\'{{responsible}}\')"><i class="material-icons">&#xE872;</i></a>'+
                '</td>'+
            '</tr>';
    let array = [];
    let position = 1;
    if (data.length > 0) {
    data.forEach(element => {
        console.log("element =",element);
        let aux = item;
        aux = aux.replaceAll("{{code}}", element.ID);
        aux = aux.replace("{{ID}}", position);
        aux = aux.replaceAll("{{responsible}}", element.responsible);
        aux = aux.replaceAll("{{description}}", element.description);
        aux = aux.replace("{{date}}", element.date);
        aux = aux.replace("{{limitDate}}", element.limitDate);
        aux = aux.replace("{{status}}", element.status);
        array.push(aux);
        position++;
        console.log("array =", array );
    });    
    document.getElementById("dataTasks").innerHTML = array.join(""); //el parametro del join es el separador
} else{
    // El objeto result no tiene datos, generar mensaje en la tabla
    item = '<tr>'+
            '<td colspan = "7" style="text-align: center;" >NO HAY TAREAS CREADAS</td>'+
            '<tr />'
    document.getElementById("dataTasks").innerHTML = item;
}

    
};

/* Validaciones para exigir el llenado de todos los datos */

const formValidation = () => {
    let valid = true;
    let responsible = document.getElementById("responsable").value;
    let description = document.getElementById("descripcion").value;
    let date = document.getElementById("fechaInicio").value;
    let partesFecha = date.split("-");
    let fechaFormato = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
    let dateLimit = document.getElementById("fechaLimite").value;
    let partesFechaLimit = dateLimit.split("-");
    let fechaFormatoLimit = `${partesFechaLimit[2]}/${partesFechaLimit[1]}/${partesFechaLimit[0]}`;
    let status = document.getElementById("estatus").value;

    // validar responsable
    let nombreRegex = /^[a-zA-Z\s]+$/;
    if (!nombreRegex.test(responsible)) {
      alert('Favor seleccione un responsable del listado');
      valid = false;
      return;
    }
    // validar descripcion
    let descripcionRegex = /[A-Za-z0-9]+/g;
    if (!descripcionRegex.test(description)) {
        alert('La descripcion solo puede admitir letras, numeros y espacios');
        valid = false;
        return;
    }
    console.log("description.length ",description.length);
    if (description.length < 5) {
        alert('La descripcion debe tener como minimo 5 caracteres');
        valid = false;
        return;
    }
    // validar fechas
    let fechaRegex = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/;
    let hoy = new Date().toLocaleDateString('en-GB');
    console.log("hoy = ",hoy);
    console.log("fechaFormato = ",(hoy < fechaFormato));
    if (!fechaRegex.test(fechaFormato) && (hoy < fechaFormato)) {
        alert('Por favor, seleccione una fecha con el calendario o ingrese con el formato DD/MM/AAAA, que sea mayor a la fecha actual. ');
        valid = false;
        return;
    }
    if (!fechaRegex.test(fechaFormatoLimit) && (hoy < fechaFormatoLimit)) {
        alert('Por favor, seleccione una fecha con el calendario o ingrese con el formato DD/MM/AAAA, que sea mayor a la fecha actual. ');
        valid = false;
        return;
    }
    if(fechaFormatoLimit < fechaFormato){
        alert("La fecha limite no puede ser menor a la fecha inicial.");
        valid = false;
        return;
    }
    // validar estatus
    if (!nombreRegex.test(status)) {
        alert('Favor seleccione un estatus del listado');
        valid = false;
        return;
      }
      return valid;
      
}

/* 
INFO @@ 
#### Significado de CRUD en programación y métodos HTTP utilizados

En programación, CRUD es un acrónimo que se utiliza para referirse a las operaciones fundamentales de gestión de datos en sistemas de bases de datos. Las operaciones CRUD son las siguientes:

- **Create (Crear)**: Esta operación se utiliza para crear nuevos registros en la base de datos. En el contexto de HTTP, el método utilizado para la operación de creación es el **POST**.

- **Read (Leer)**: Esta operación se utiliza para leer o recuperar registros existentes de la base de datos. En el contexto de HTTP, el método utilizado para la operación de lectura es el **GET**.

- **Update (Actualizar)**: Esta operación se utiliza para actualizar registros existentes en la base de datos. En el contexto de HTTP, el método utilizado para la operación de actualización es el **PUT** o el **PATCH**.

- **Delete (Borrar)**: Esta operación se utiliza para eliminar registros existentes de la base de datos. En el contexto de HTTP, el método utilizado para la operación de eliminación es el **DELETE**.

Es importante tener en cuenta que los métodos HTTP utilizados pueden variar dependiendo de la implementación y las convenciones utilizadas en el desarrollo de la API o aplicación específica.

Espero que esta información te sea útil. Si tienes alguna otra pregunta, no dudes en hacerla.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

************************************************************************
 NOTAS SAP CAP -- COMANDOS
 ************************************************************************
1- Dentro de la carpeta del proyecto - ponemos el siguiente comando para inicializar y generar la estructura base:
---- 'cds init'
*__ Se puede crear todo desde cero si se hace de la siguiente forma:
---- 'cds init projectNameFolder'
Esto crearia la carpeta con su estructura.

2- Ahora necesitamos instalar cualquier dependencia que sea necesaria, por lo que ejecutamos el siguiente comando:
---- 'npm install'
*__ Esto basicamente lo que hace es crearnos nuestra carpera 'node_modules' donde estaran 
todas las dependencias necesarias para la construccion de la aplicacion.

3- Con el fin de realizar el servicio CAP pasamos a crear el 'esquema/entidades/tablas para relaciones de base de datos'
*__ En este sentido debemos posicionarnos dentro de la estructura de nuestro proyecto en la carpeta 'db' y crearemos
el archivo con extension '.cds' por ejemplo 'esquema.cds'

*__ Para inicializar el archivo:
using { Currency,managed,sap,cuid} from '@sap/cds/common';
//Currency es un dataType - - podria declararse una variable en el esquema y eso genera tablas nuebas - Manejo de moneta etc
//managed: Aporta - Create Date, Update Date, Create User, Modify User.  
//sap  creacion de llaves primarias para definir entidades, 
// common types and aspect https://cap.cloud.sap/docs/cds/common

4- Si ya tenemos una 'enditad/tabla' creada, debemos ejecutar los siguientes comandos para que podamos comenzar
a usarla, osea, que ya comience a tener informacion:

- Se hace un Deploy a la DB, definiendo que va a existir una persistencia de datosDeNavegacion, y asi no se perderan en cada ejecucion.
---- 'npm add sqlite3 -D >> cds deploy --to sqlite:myName.db'
---- 'cds deploy --to sqlite:myName.db' --> Este comando se usara siempre para actualizar cambios en las 'entidades/tablas'
*__ Ya asi se crearia la Base de datos y se puede verificar en la ruta: 'projectNameFolder/myName.db'
Para vertical, se puede descargar el complemento 'SQLite Viewer'

5- Cuando deseas ya meter informacion en las 'entidades/tablas' de base datos, es cuando se hace necesario tener un 'Servicio'
para la creacion manejamos la siguiente estructura:

*__ En la siguiente ruta creamos el archivo con extension '.cds', ejemplo 'projectNameFolder/srv/myNameService.cds'
*__ En este punto aun no podemos visualizar nada en caso de que se decida correr el proyecto, ya que no existe nada definido en el servicio.

6- Lo necesario para que mi 'Servicio' funcione:
*__ En este punto lo primero es asociar el servicio a mi 'projectNameFolder/db/esquema.cds'
Se debe indicar el 'namespace my.ejemplo' el nombre puede ser cualquiera.
using { my.ejemplo as db } from '../db/esquema';

Nota: Al utilizar 'as' estamos colocabdo un sobrenombre o alias al namespase

7- Para hacer un 'Run' correr nuestro proyecto ejecutamos el comando:
---- 'cds watch'
*__ Si todo sale bien, deberiamos ver algo como lo siguiente:
[cds] - serving AdminService { at: '/admin' }
[cds] - serving CatalogService { at: '/browse', impl: 'bookshop/srv/cat-service.js' }
[cds] - server listening on { url: 'http://localhost:4004' }
*__ La ultima 'URL' seria la qiue usaremos para ver el resultado.


8- Cualquier estructura visual se maneja dentro de la ruta 'projectNameFolder/app'
Ejemplo: 'alumnosview.html'
*__ Otro punto relevante es que toda la logica tambien es definida en esta ruta, por ejemplo podemos
crear una carpeta 'Controller' y aca definir los archivos 'projectNameFolder/app/controllers/controllerAlumnos.js'
********************************* END ************************************
JAVA
Comando: 'mvn -B archetype:generate -DarchetypeArtifactId=cds-services-archetype -DarchetypeGroupId=com.sap.cds \
-DarchetypeVersion=RELEASE -DjdkVersion=17 \
-DgroupId=com.sap.cap -DartifactId=products-service -Dpackage=com.sap.cap.productsservice'

Comando: 'mvn -B archetype:generate -DarchetypeArtifactId=cds-services-archetype -DarchetypeGroupId=com.sap.cds \
-DarchetypeVersion=RELEASE -DjdkVersion=17 \
-DgroupId=com.sap.cap -DartifactId=bookstore'
Comando: 'mvn clean install'
Des: Se usa para activar el proceso de compilación de Maven.
Comando: 'cd ~/projects/products-service && mvn clean spring-boot:run'
Des: Se utiiza para posicionarte en la raiz del project y correr el mismo.
por si solo, seria: 'mvn clean spring-boot:run'

Comandos variados:
'cd ~/projects/products-service && mvn clean spring-boot:run'

Ispeccionar OData
'/odata/v4/AdminService/$metadata'

Intente consultar categorías individuales, por ejemplo agregando lo siguiente al final de la URL de su aplicación:

'/odata/v4/AdminService/Categories(10)'

También puede expandir las estructuras anidadas. Agregue lo siguiente al final de la URL de su aplicación:

'/odata/v4/AdminService/Categories?$expand=children'
'/odata/v4/AdminService/Categories(10)?$expand=parent'
'/odata/v4/AdminService/Categories(1)?$expand=children'

Asegúrese de detener su aplicación después de probarla usando CTRL+C.

Instale el proyecto de servicio reutilizable como dependencia npm:
Comando:'npm install $(npm pack ../products-service -s)'
Des: 'npm packcrea un tarball a partir de products-service, que luego se usa directamente como una dependencia en la aplicación de la librería. Más información sobre npm pack: ​​https://docs.npmjs.com/cli-commands/pack.html .Encontrarás un sap-capire-products-1.0.0.tgzen la carpeta raíz del proyecto de la librería, que es el archivo tarball del products-serviceproyecto.'

Instale todos los demás paquetes y simplifique la estructura de dependencia general npm dedupe:
'npm install && npm dedupe'

Parametro de consulta 
'/odata/v4/BooksService/Books   +   ?sap-locale=es'

'cf api <CF_API_ENDPOINT>'
'cf login'

Deployed de la DB SQL
'cds deploy --to sqlite:my.sqlite'

Cree una instancia de servicio SAP HANA e implícitamente envíe todos los artefactos a la base de datos usando:
'cds deploy --to hana:bookstore-hana --store-credentials'

Probemos la conectividad de SAP HANA. Inicie su aplicación ejecutando:
'mvn spring-boot:run -Dspring-boot.run.profiles=cloud'


Ahora está listo para enviar su aplicación a la nube ejecutando los siguientes comandos desde la terminal en SAP Business Application Studio:

Asegúrate de estar en la raíz del proyecto de la librería:
'cd ~/projects/bookstore'
Construya su aplicación una vez ejecutando:
'mvn clean install'
Empuje la aplicación a la nube ejecutando:
'cf push'
Para recuperar la URL de la aplicación, ejecute el siguiente comando:
'cf app bookstore'

'bookstore-empathic-crocodile-wa.cfapps.us10-001.hana.ondemand.com'

*********
comando: 'cf env bookstore'
"url": "https://23584a8ctrial.authentication.us10.hana.ondemand.com"
"clientid": "sb-bookstore!t204697",
"clientsecret": "SYxHFK/J2+ql2z9NIMuyHdjNJMc=",

bookstore-empathic-crocodile-wa.cfapps.us10-001.hana.ondemand.com

--------------------
OData CRUD+Q

Agregar producto:
'user: northbreeze $ curl -H "Content-Type: application/json" -d '{"ProductID":77,"ProductName":"Original Frankfurter grüne Soße","UnitsInStock":32}' http://localhost:4004/main/Products
{"@odata.context":"$metadata#Products/$entity","ProductID":77,"ProductName":"Original Frankfurter grüne Soße","UnitsInStock":32}'


****************************************************
*/