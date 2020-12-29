const router = require('express').Router();
const { getLast5Days, getTipoCambio } = require('../controllers/tipoCambioController');

// Obtener tipo de cambio
router.get('/dolares/:id', async (req, res)=>{

    const fecha = (req.params.id).toString();
    
    const arregloFechas = getLast5Days(fecha);
    if(!arregloFechas){
        return res.status(400).json({
            message: 'Fecha no encontrada'
        });
    }

    const tipoCambio = await getTipoCambio(arregloFechas);
    if(!tipoCambio){
        return res.status(400).json({
            error:'Tipo de cambio no encontrado'
        });
    }

    res.json(tipoCambio);
    
})

module.exports = router;