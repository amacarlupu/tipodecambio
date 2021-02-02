const puppeteer = require('puppeteer');

// Funcion autoejecutada
async function getTipoCambio(fecha) {

    let tipoCambio = [];

    const browser = await puppeteer.launch({ headless: false, args:["--no-sandbox"] }); // abrir el navegador
    const page = await browser.newPage(); // crear una nueva pagina
    await page.setDefaultTimeout(0)
    await page.goto('https://www.sbs.gob.pe/app/pp/SISTIP_PORTAL/Paginas/Publicacion/TipoCambioPromedio.aspx');

    for (let i = 0; i < fecha.length; i++) {

        await page.type('#ctl00_cphContent_rdpDate_dateInput', `${fecha[i]}`);
        await page.click('#ctl00_cphContent_btnConsultar');
        console.log('Fecha actual: ', fecha[i]);


        // if(await page.waitForFunction( `document.querySelector(".JERF_texto1")`)){
        //     await page.waitForNavigation({ waitUntil: "load"});

        //     if(await page.waitForFunction( `document.querySelector(".titulo").innerText.includes("Página no encontrada")`)){
        //         console.log('Que hay perro');
        //         // await browser.close();
        //         continue;
        //     }
        // 

              if (await page.waitForSelector('.JERF_texto1')) {
            console.log('Que hay perro');
            break;
        }
        await page.waitForTimeout(5000);


           await page.waitForFunction(`document.querySelector("#ctl00_cphContent_lblFecha").innerText.includes("${ fecha[i] }")`);


     
        console.log('y yo que');


        // await page.waitForTimeout(5000);

        const elementos = await page.evaluate(() => {

            const pruebas = {};
            const cambios = document.querySelectorAll('#ctl00_cphContent_rgTipoCambio_ctl00__0 td');
            const fecha = document.querySelector('#ctl00_cphContent_lblFecha').innerText.split(' ');
            pruebas.fecha = fecha[fecha.length - 1].toString();

            for (let i = 0; i < cambios.length; i++) {
                pruebas.moneda = cambios[0].innerText;
                pruebas.compra = cambios[1].innerText;
                pruebas.venta = cambios[2].innerText;
            }

            return pruebas;
        })

        tipoCambio.push(elementos);
    }

    await browser.close();
    let cambioActual;
    console.log('tipo de cambio: ', tipoCambio);

    for (let i = 0; i < tipoCambio.length; i++) {

        if (tipoCambio[i].moneda === undefined) {
            cambioActual = tipoCambio[i + 1];
        } else {
            cambioActual = tipoCambio[i];
            break;
        }

    }

    console.log('Por fin!!!!', cambioActual);
    // return cambioActual; 

}



const valor = getLast5Days('29122020');
console.log('Resultado de getLast5Days: ', valor);
// const nuevoValor = getTipoCambio(valor)
//     .then( (res)=>{
//         console.log('Impresion:',res);
//     });

const nuevoValor = getTipoCambio(valor);
console.log('Tipo de cambio final: ', nuevoValor);

function diasEnUnMes(mes, año) {
    return new Date(año, mes, 0).getDate();
}

function getLast5Days(fecha) {

    const dayConvertido = fecha.slice(0, -6);
    const mesConvertido = fecha.slice(2, -4);
    const anioConvertido = fecha.slice(-4);
    fecha = `${dayConvertido}/${mesConvertido}/${anioConvertido}`;


    const fechas = [];

    for (let i = 0; i < 5; i++) {

        // Obtener dia, mes, año y la funcion con los dias por mes
        let mes = fecha.slice(3, -5);
        let anio = fecha.slice(-4);
        let day = Number(fecha.slice(0, -8));

        // Si el dia es 01, entonces se mostrará el ultimo dia del mes anterior, 
        // en el caso de enero se mostrará diciembre del año anterior
        if (day === 01) {

            if (mes === '01') {
                mes = '12';
                anio = Number(anio) - 1;
                day = diasEnUnMes(mes, anio);
            } else {
                mes = (Number(mes) - 1).toString();
                day = diasEnUnMes(mes, anio);
            }
            // Si no es 01, solo restar un dia 
        } else {
            day = day - 1;
        }

        // Si estamos en la primera iteracion, guardar la fecha sin modificar
        // if (i === 0) {
        //     fechas.push(fecha);
        // } else {
        let dayFormat = (day.toString()).padStart(2, '0');
        let mesFormat = (mes.toString()).padStart(2, '0');
        let anioFormat = anio.toString();
        let fechaActualizada = `${dayFormat}/${mesFormat}/${anioFormat}`;
        fechas.push(fechaActualizada);
        fecha = fechaActualizada;
        // }
    }
    return fechas;

}