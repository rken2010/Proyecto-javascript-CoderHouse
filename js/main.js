// Productos en venta //

const URL_DB = "db/data.json";
const URL_NEGOCIOS = "db/dataLocales.json";


class Menu{
  constructor(){
    this.lista = [];
  }
}

var menu = new Menu();

$.get( URL_DB, (response , status) => {
    if(status ==`success`){
      menu = response;
    }
      else {
        throw new Error('error')
      }
      renderMenu();
});

    //  LOCALES //
const locales =  [];
$.get( URL_NEGOCIOS, (response , status) => {
  if(status ==`success`){
    response.forEach((response) => {
      locales.push(response)
    })
  }
    else {
      throw new Error('error')
    }
  renderLocales();    
  })


// RENDERIZAR LOCALES //
function renderLocales(){
  const containerLocales = document.querySelector("#listaLocales");
  locales.forEach ((locales) => {
    const localesDisponibles = document.createElement("div")
    localesDisponibles.classList.add('locales');
    localesDisponibles.innerHTML = `
          <div>
          <img src="${locales.imagen}" alt="${locales.nombre}" class="locales__img">
          <div class="locales__datos">
            <h3 class="locales__datos--titulo">${locales.nombre}</h3>
            <p>Localidad: ${locales.localidad}</p>
            <p>Dirección:${locales.direccion}</p>
            <p>Teléfono:${locales.telefono}</p>
          </div>  
          <a href="${locales.mapa}"><button class="bt-mapa">Mapa</button></a>  
          </div>
    `;
    containerLocales.appendChild( localesDisponibles );
  });
  };

// Funciones y objeto pedido //

function agregarAlPedido( id ) {
    let repetido = compra.find( element => element.id == id )
    if ( repetido ) {
      repetido.cantidad = parseInt( repetido.cantidad ) + 1;
      
      Swal.fire({
        title: 'Agregado',
        text: `${repetido.nombre}`+"fue agregado",
        imageUrl: `${repetido.foto}`,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: `${repetido.nombre}`,
      })
    }
    else{
      let comida = buscarItem(id);
      comida.cantidad = parseInt ( comida.cantidad )+1
      compra.push(comida);

      Swal.fire({
        title: 'Agregado',
        text: `${comida.nombre}`+" fue agregado",
        imageUrl: `${comida.foto}`,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: `${comida.nombre}`,
      })
    }

      renderPedido();  
         
  }

function buscarItem( id ) {
    const producto = menu.find( element => element.id == id )

      if ( !id ) {
          throw new Error('No tenemos esa comida: ' + id)
      }
      return producto;
    
  }

function borrarProducto( id ) {
      const item = buscarItem( id );

      if (parseInt( item.cantidad )<= 1){
      compra = compra.filter( compra => compra.id != item.id)
      }
      else{
        item.cantidad = parseInt(item.cantidad) - 1;
      }
      renderPedido();
      
  }

 
// Funciones de compra //

var compra = JSON.parse(localStorage.getItem('Pedido')) || [];

// VACIAR CARRITO
  const vaciar = document.getElementById("vaciarPedido");
  vaciar.addEventListener("click", ()=>{
  compra =[];
  localStorage.setItem('Pedido', JSON.stringify(compra));
  renderPedido();
  });

function importePedido(){
  let totalPedido = 0;
    compra.forEach((item) => {
      totalPedido += item.precio * item.cantidad;
    })
    return totalPedido;
  }

function renderMenu(){
const containerMenu = document.querySelector("#catalogoMenu");
menu.forEach ((menu) => {
  const menuDisponible = document.createElement("div")
  menuDisponible.className="menu__producto";
  menuDisponible.innerHTML = `
    <div class="card__txt">
      <h4>${menu.nombre}</h4>
      <p>${menu.descripcion}</p>
      <p>Precio: $ ${menu.precio}</p>
      <button onclick="agregarAlPedido(${menu.id})" class="bt-compra">Agregar</button>
    </div>  
    <div class="card__img">
      <img src="${menu.foto}" alt="${menu.nombre}">
    </div>
    `;
  containerMenu.appendChild( menuDisponible );
});
};

function renderPedido(){
  const tablaPedido = document.getElementById("tabla-contenedor");
  const total = document.querySelector("#total")
  tablaPedido.innerHTML = ``;
  compra.forEach((compra) => {
    const tr = document.createElement("tr");
    tr.className = "table-primary";
    tr.innerHTML =`
      <td>${compra.nombre}</td>
      <td><i class="fas fa-minus bt-mas_menos" onclick="borrarProducto(${compra.id})"></i>${compra.cantidad}<i class="fas fa-plus bt-mas_menos" onclick="agregarAlPedido(${compra.id})"></i></td>
      <td>$ ${compra.precio}</td>
      <tr>
    `;
    tablaPedido.appendChild(tr);
  });
  total.innerHTML = `
    <td>TOTAL: $${importePedido()}</td>
  `
  localStorage.setItem( 'Pedido', JSON.stringify(compra) );
}

// INICIALIZAR FUNCIONES // 


renderPedido();

