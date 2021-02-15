// Hacer un div dentro de otro div
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

  getTiendas(btnSelect);
}

/**
 * Nos muestra todas las tiendas
 * 
 * @param {String} method Nombre del botón que hemos seleccionado
 */
async function getTiendas(method) {
  var loader = document.getElementById("loader");
  var consulta = document.getElementById("consulta");
  var datos;
  loader.style.display = "flex";
  
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
 * Nos muestra todas las tiendas utilizando el método de Xhr
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
 * Nos muestra todas las tiendas utilizando el método de Fetch
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
 * Nos muestra todas las tiendas utilizando el método de JQuery
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
 * Creamos y mostramos los nodos de las tiendas
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
btnNewTienda.addEventListener('click', sowPushTienda, true);

/**
 * Ocultamos/Mostramos el div del formulario para introducir tiendas
 */
function sowPushTienda() {
  var divAddTienda = document.getElementById('divAddTienda');

  if ((divAddTienda.style.height == '0px') | (divAddTienda.style.height == '')) {
    divAddTienda.style.height = "225px";
    divAddTienda.style.border = '2px solid rgb(1, 87, 1)';
  } else {
    divAddTienda.style.height = '0px';
  }
}

// Buscamos tienda por IdTienda
var btnBuscarTienda = document.getElementById("btnBuscar");
btnBuscarTienda.addEventListener("click", getTienda);

/**
 * Mostramos la tienda que hemos obtenido según el id
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
 * Limpiamos los datos de las tiendas, extraemos el JSON de la tienda que buscamos y mostramos la tienda por DOM
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
var btnPushTienda = document.getElementById("btnPushTienda");
btnPushTienda.addEventListener("click", () => {
  btnPushTienda.style.backgroundColor = "#b4ecb4";
  cargando(btnPushTienda);
  // checkForm()
});

/**
 * Cambiamos el texto del boton y le ponemos un spinner y "Cargando"
 * @param {*} btnPushTienda Boton para hacer push a la tienda
 */
function cargando(btnPushTienda) {
  btnPushTienda.textContent = "";
  var imgLoaderPush = createNode('img', [], "", "loaderPush", "./img/loader.png");
  btnPushTienda.append(imgLoaderPush, "Cargando");
}

// Validación de los inputs
var inputsValidar = document.querySelectorAll('[class="inptValid"]');
inputsValidar.forEach(campo => {
  var msgError = campo.parentElement.lastElementChild;
  campo.addEventListener('input', () => checkInput(campo, msgError));
});

function checkInput(campo, msgError) {
    if(campo.validity.valueMissing){
      msgError.textContent = "Campo obligatorio";
      campo.style = "border: 2px solid red";

    }else{
      msgError.textContent = "";
      campo.style = "border: 2px solid green";
    }

    if(msgError.id == "telf"){
      if(campo.validity.patternMismatch){
        msgError.textContent = "Debe empezar con 6,8,9 y deben ser 9 cifras";
      campo.style = "border: 2px solid red";
      }
    }
}