const monedaSelect = document.querySelector('#moneda');
const resultado = document.querySelector('#resultado');
const nuevoMonto = document.querySelector('#nuevo-monto');
const btnBuscar = document.querySelector('#botonBuscar');
const myChart = document.querySelector('#myChart');
const baseUrl = 'https://mindicador.cl/api';
let chart = null;


async function obtenerMonedas() {
    let data = null;
       try {
           const res = await fetch("https://mindicador.cl/api/");
            data = await res.json();
           return data;
       } catch (error) {
           console.error('Falla al rescatar datos de API', error);
           
       }
   }

   async function renderCambio() {
    const valores = await obtenerMonedas();
    let template = "";

    for (const valor in valores) {
        console.log('valor', valores[valor]);
        if(valores.hasOwnProperty(valor) && typeof valores[valor] === 'object') {
            template += `<option value="${valores[valor].codigo}">${valores[valor].nombre}</option>`;
        }
    };

    monedaSelect.innerHTML = template;
}

renderCambio();

async function convertirMoneda() {

    const monedaDeCambio = monedaSelect.value;
    let montos = nuevoMonto.value ;
    console.log(montos)
    let datos;
    try {
        datos = await fetch(`https://mindicador.cl/api/${monedaDeCambio.toLowerCase()}`);
        const datas = await datos.json();
        console.log(datas);
        console.log(datas.serie[0].valor);
        let valor = datas.serie[0].valor;
        console.log(valor)
        let conversion = montos / valor;
        console.log(conversion)
        resultado.innerHTML =`<h3>Resultado: $${conversion.toFixed(2)}</h3>`;
    
        renderGrafico()
    } catch (error) {
            console.error('Error al descargar la API:', error);
    
    }
}

btnBuscar.addEventListener('click', convertirMoneda);

async function renderGrafico(){
    const valorConversion = monedaSelect.value; 
    const datos = await fetch(`https://mindicador.cl/api/${valorConversion.toLowerCase()}`)
    const dataChart = await datos.json();
      const labels = dataChart.serie.slice(0,10).map((item) => {return item.fecha.substring(0,10)});
      const valores = dataChart.serie.slice(0,10).map((item) => {return item.valor});
      const config = {
          type: 'line',
          data: {
          labels: labels,
          datasets: [
              {
                  label: 'Historial últimos 10 días',
                  backgroundColor: 'red',
                  data: valores
                  }]}
        };
  
        const chartDOM = document.getElementById("myChart");
        if (chart) {
            chart.destroy();
        }
        chartDOM.style.backgroundColor = 'white';
        chart = new Chart(chartDOM, config);
        chartDOM.innerHTML = chart;
}