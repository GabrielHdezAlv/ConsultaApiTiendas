// Haciendo los post de la información
var btnSelect;

var btns = document.getElementsByClassName('btns');
for (let index = 0; index < btns.length; index++) {
  btns[index].addEventListener('click', (event) => letsStart(event));
} 

/**
 * Mostramos el loader y llamamos a "getTiendas" para mostrar las tiendas
 *
 * @param {Event} event Evento de cualquiera de los botones del main
 */
function letsStart(event) {
  btnSelect = event.target.textContent;
  var main = event.target.parentNode;
  main.style.display = 'none';

  var loader = document.getElementById("loader");
  loader.style.display = "flex";

  getTiendas(btnSelect);
}

/**
 * Nos muestra todas las tiendas según el botón seleccionado
 * 
 * @param {String} method Nombre del botón que hemos seleccionado
 */
async function getTiendas(method) {
  var loader = document.getElementById("loader");
  var consulta = document.getElementById("consulta");
  var datos;
  
  if (method == 'XHR') {
    datos = await getXhr();
  } else if (method == 'Fetch') {
    datos = await getFetch();
  } else if (method == 'jQuery') {
    datos = await getJquery();
  }

  loader.style.display = "none";
  consulta.style.display = "flex";
  mostrarDatos(datos);
}

/**
 * Nos muestra o todas las tiendas o 1 utilizando el método de Xhr
 */
async function getXhr(valor) {
  return await new Promise(function (resolve) {
    let xhr = new XMLHttpRequest();
    if ((valor != null) && (valor != "")){
      xhr.open("GET", "https://webapp-210130211157.azurewebsites.net/webresources/mitienda/" + valor);
    }else{
      xhr.open("GET", "https://webapp-210130211157.azurewebsites.net/webresources/mitienda/");
    }
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
            resolve(JSON.parse(xhr.response));
        }
    };
    xhr.send();
  });
}

/**
 * Nos muestra o todas las tiendas o 1 utilizando el método de Fetch
 */
async function getFetch(valor) {
  var link;

  if ((valor != null) && (valor != "")){
    link = "https://webapp-210130211157.azurewebsites.net/webresources/mitienda/" + valor;
  }else{
    link = "https://webapp-210130211157.azurewebsites.net/webresources/mitienda/";
  }

  return await fetch(link)
  .then(response => response.text())
  .then(datos => {
    return JSON.parse(datos)
  })
}

/**
 * Nos muestra o todas las tiendas o 1 utilizando el método de JQuery
 */
async function getJquery(valor) {
  var link;

  if ((valor != null) && (valor != "")){
    link = "https://webapp-210130211157.azurewebsites.net/webresources/mitienda/" + valor;
  }else{
    link = "https://webapp-210130211157.azurewebsites.net/webresources/mitienda/";
  }

  return await $.ajax({
    type: "GET",
    url: link,
    async: true,
    dataType: "json",
    success: data => {
      return data
    }
  });
}

/**
 * Creamos y mostramos los nodos de la/las tiendas
 * @param {Array} tiendas Array de tiendas
 */
function mostrarDatos(tiendas) {
  var divDatos = document.getElementById("divDatos");

  tiendas.forEach(tienda => {
    var div = createNode('div', ["divTiendas"], "", "", "")
      var h1 = createNode('h1', [], tienda.nombreTienda, "", "");
      var direccion = createNode('h2', [], tienda.direccion, "", "");
      var telefono = createNode('h2', [], tienda.telefono, "", "");

    div.append(h1, direccion, telefono);

    divDatos.appendChild(div);
  });
}

var btnNewTienda = document.getElementById('btnAddTienda');
btnNewTienda.addEventListener('click', sowPostTienda, true);

/**
 * Ocultamos/Mostramos el div del formulario para introducir tiendas
 */
function sowPostTienda() {
  var divAddTienda = document.getElementById('divAddTienda');
  var despliegue = document.getElementById('despliegue');

  if ((despliegue.style.height == '0px') | (despliegue.style.height == '')) {
    despliegue.style.height = "380px";
    divAddTienda.style.border = '2px solid rgb(1, 87, 1)';
  } else {
    despliegue.style.height = '0px';
  }
}

// Buscamos tienda por IdTienda
var btnBuscarTienda = document.getElementById("btnBuscar");
btnBuscarTienda.addEventListener("click", async() => {

  var inputIdTienda = document.getElementById("inputGetTienda");
  if ((inputIdTienda.value != "") && (parseInt(inputIdTienda.value))){
    if(btnBuscarTienda.textContent != "X"){
      btnBuscarTienda.textContent = "";
      var imgLoaderId = createNode('img', [], "", "loaderIdTienda", "./img/loader.png");
      btnBuscarTienda.appendChild(imgLoaderId);

      getTienda();

      btnBuscarTienda.textContent = "";
      btnBuscarTienda.innerHTML = "X";
    }else{
      btnBuscarTienda.textContent = "";
      var lupa = createNode('img', [], "", "", "./img/lupa.png");
      btnBuscarTienda.appendChild(lupa);
      inputIdTienda.value = "";

      getTiendas(btnSelect);
    }
  }else{
    alert("Debe introducir un id");
  }
});

/**
 * Validamos el input del IdTienda
 */
function getTienda() {
  var inputTienda = document.getElementById("inputGetTienda").value;
  
  if ((inputTienda != "") & (inputTienda != null)){
    if (parseInt(inputTienda)){
      inputId(inputTienda);
    }else{
      alert("Debes introducir un número");
    }
  }else{
    alert("Debe rellenar el campo con un id válido");
  }
}

/**
 * Vaciamos el div de las tiendas, obtenemos y mostramos la tienda
 * @param {String} inputTienda Número de la tienda que obtenemos del input
 */
async function inputId(inputTienda) {
  cleanDatos();
  var dato;

  if(btnSelect == "XHR"){
    dato = await getXhr(inputTienda);
  }else if(btnSelect == "Fetch"){
    dato = await getFetch(inputTienda);
  }else if(btnSelect == "jQuery"){
    dato = await getJquery(inputTienda);
  }

  mostrarDatos([dato]);
}

/**
 * Limpiamos el div de los datos de las tiendas
 */
function cleanDatos() {
  var divDatos = document.getElementById("divDatos");
  while(divDatos.firstElementChild != null){
    divDatos.removeChild(divDatos.firstElementChild);
  }
}

/**
 * Creación de nodos
 * @param {String} nodeValue Tipo de nodo que vamos a crear
 * @param {Array} nodeClasses Clases para introducir en nuestro nodo
 * @param {String} nodeText Texto que contenga nuestro nodo
 * @param {String} nodeId Id que le asignamos al noo
 * @param {String} nodeSrc Ruta en la que está la imagen del nodo
 */
function createNode(nodeValue, nodeClasses, nodeText, nodeId, nodeSrc) {
  var node = document.createElement(nodeValue);

  if (nodeClasses.length != 0){
    nodeClasses.forEach(nodeClase => {
      node.className = nodeClase;
    });
  }

  if((nodeText != null) && (nodeText != "")){
    node.appendChild(document.createTextNode(nodeText));
  }

  if((nodeId != null) && (nodeId != "")){
    node.id = nodeId;
  }

  if((nodeSrc != null) && (nodeSrc != "")){
    node.src = nodeSrc;
  }

  return node;
}

// Introducir Tienda
var btnPostTienda = document.getElementById("btnPushTienda");
btnPostTienda.addEventListener("click", async () => {
  btnPostTienda.style.backgroundColor = "#b4ecb4";

  if (checkForm()){
    var obj = crearObj();
    cargando(btnPostTienda);
    await postTienda(obj);
    cleanDatos();
    clearForm();
    document.getElementById("despliegue").style.height = "0px";
    getTiendas(btnSelect);
  }else{
    alert("Tiene que poner correctamente todos los campos del formulario");
  }
});

/**
 * Cambiamos el texto del boton y le ponemos un spinner y "Cargando"
 * @param {*} btnPostTienda Boton para hacer post a la tienda
 */
function cargando(btnPostTienda) {
  btnPostTienda.textContent = "";
  btnPostTienda.disabled = true;
  var imgLoaderPost = createNode('img', [], "", "loaderPush", "./img/loader.png");
  btnPostTienda.append(imgLoaderPost, "Cargando");
}

// Validación de los inputs
var inputsValidar = document.querySelectorAll('[class="inptValid"]');
inputsValidar.forEach(campo => {
  var msgError = campo.parentElement.lastElementChild;
  campo.addEventListener('input', () => checkInput(campo, msgError));
});

/**
 * Validamos el input
 * @param {*} campo Input que validamos
 * @param {*} msgError etiqueta 'p' en el que mostramos el mensaje de error
 */
function checkInput(campo, msgError) {
  var okey = false;  
  if(campo.validity.valueMissing){
      msgError.textContent = "Campo obligatorio";
      campo.style = "border: 2px solid red";

  }else{
    msgError.textContent = "";
    campo.style = "border: 2px solid green";
    okey = true;
  }

  if(msgError.id == "telf"){
    if(campo.validity.patternMismatch){
      msgError.textContent = "Debe empezar con 6,8,9 y deben ser 9 cifras";
    campo.style = "border: 2px solid red";
    okey = false;
    }
  }
  return okey;
}

/**
 * Validamos todos los input a la vez
 */
function checkForm() {
  var comprobado = false;
  var validado = 0;
  

  inputsValidar.forEach(input => {
    var msgError = input.parentElement.lastElementChild;
    if(checkInput(input, msgError)){
      validado++;
    }
  });

  if(validado == 4){
    comprobado = true;
  }
  return comprobado;
}

/**
 * Creamos el objeto a introducir en la base de datos
 */
function crearObj() {
  var name = document.getElementById("inputName").value;
  var direc = document.getElementById("inputDirect").value;
  var local = document.getElementById("inputLocal").value;
  var telf = document.getElementById("inputTlf").value;

  var obj  = {
    nombreTienda: name,
    direccion: direc,
    localidad: local,
    telefono: telf
  }

  return obj;
}

/**
 * Según el boton llamamos a un función u otra para hacer el POST
 * @param {Oject} obj Objeto con los datos recogidos de los inputs
 */
async function postTienda(obj) {
  if (btnSelect == 'XHR') {
    await postXhr(obj);
  } else if (btnSelect == 'Fetch') {
    await postFetch(obj);
  } else if (btnSelect == 'jQuery') {
    await postJquery(obj);
  }
}

/**
 * Introducimos el objeto en la base de datos con el método Xhr
 * @param {Object} obj Objeto con los datos recogidos de los inputs
 */
async function postXhr(obj) {
  var xhrPost = new XMLHttpRequest();
  xhrPost.open("POST", 'https://webapp-210130211157.azurewebsites.net/webresources/mitienda/');
  xhrPost.setRequestHeader("Content-Type", "application/json");
  await xhrPost.send(JSON.stringify(obj));
}

/**
 * Introducimos el objeto en la base de datos con el método Fetch
 * @param {Object} obj Objeto con los datos recogidos de los inputs
 */
async function postFetch(obj) {
  await fetch('https://webapp-210130211157.azurewebsites.net/webresources/mitienda/', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers:{
      "Content-type": "application/json"
    }
  }).then(res => res.json())
  .catch(error => console.log('Error:', error));
}

/**
 * Introducimos el objeto en la base de datos con el método jQuery
 * @param {Object} obj Objeto con los datos recogidos de los inputs
 */
async function postJquery(obj) {
  await $.ajax({
    url: 'https://webapp-210130211157.azurewebsites.net/webresources/mitienda/',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    dataType: 'json'
    });
    alert("json posted!");
}

/**
 * Volvemos el form a su estado inicial (inputs y button)
 */
function clearForm() {
  var inputs = document.getElementsByClassName("inptValid");
  
  for (let index = 0; index < inputs.length; index++) {
    inputs[index].value = "";
  }

  var btnPost = document.getElementById("btnPushTienda");
  btnPost.innerHTML = "Añadir Tienda";
  btnPost.style.backgroundColor = "lightgreen";
  btnPost.style.color = "rgb(2, 47, 2)";
  btnPost.disabled = false;
}