import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

export const ConsultaSocio = () => {
    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
    const BANCARD_COMMERCE_CODE = `${import.meta.env.VITE_API_BANCARD_COMMERCE_CODE}`;

    const [numeroSocio, setNumeroSocio] = useState('');
    const [datosSocio, setDatosSocio] = useState(null);
    const [finished, setFinished] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("Obtener Datos de la utilidad!");
    const [showActionButtons, setShowActionButtons] = useState(true);

    const handleConsultaClick = async (event) => {
        event.preventDefault()

        // Si el botón actualmente dice "Limpiar pantalla/Volver a iniciar búsqueda"
        // se resetea la pantalla y se vuelve al estado inicial
        if (buttonLabel === "Limpiar pantalla/Volver a iniciar búsqueda") {
            resetData();
            setButtonLabel("Obtener Datos de la utilidad!");
            setShowActionButtons(true);
            return;
        }

        // Validar que los campos estén completados
        if (!numeroSocio) {
            let errorMessage = ''
            let headerMessage = 'Info'
            let iconMessage = 'info'
            if (!numeroSocio) {
                errorMessage = 'Por favor, complete el dato "Número de socio"'
            }
    
            Swal.fire(headerMessage, errorMessage, iconMessage)
            return;
        } else {
            try {
                // Tu lógica existente aquí
                if (datosSocio && (datosSocio.withdrawMoney === 'N' || datosSocio.withdrawMoney === 'S')) {
                    setButtonLabel("Limpiar pantalla/Volver a iniciar búsqueda");
                } else {
                    setShowActionButtons(datosSocio && datosSocio.withdrawMoney === 'X');
                }
            } catch (error) {
                console.error("Error en withdrawMoney in ('N', 'S')");
            }
        }

        
        let errorMessage = ''
        let headerMessage = 'Info'
        let iconMessage = 'info'
        errorMessage = 'La asamblea ha concluido, muchas gracias!'

        //Swal.fire(headerMessage, errorMessage, iconMessage)
        //return;

        try {
            const url = `${BASE_URL}/socios/utility/partner-cod/${numeroSocio}`;
            const response = await axios.get(url);
            setDatosSocio(response.data);
            // Mostrar botones SI y NO
            // Asegurarte de mostrar u ocultar los botones de acción según el estado de withdrawMoney
            if (response.data.withdrawMoney === 'X') {
                setShowActionButtons(true);
            } else {
                setShowActionButtons(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Swal.fire('Error', `El socio con código ${numeroSocio} no se encuentra registrado en la base de datos.`, 'error');
            } else {
                console.error(error);
            }
            resetData();
        }
    };

    // Definición de la función para manejar cambios en el número de socio
    const handleNumeroSocioChange = (e) => {
        setNumeroSocio(e.value);
    };

    const updateWithdrawMoneyByPartnerCod = async (withdrawMoney) => {
        // Asegurarte de que datosSocio no es null para evitar errores
        if (datosSocio) {
            try {
                const url = `${BASE_URL}/socios/actualiza_datos_utilidad`;
                // Preparar el cuerpo de la solicitud
                const body = {
                    partnerCod: datosSocio.partnerCod,
                    withdrawMoney: withdrawMoney, // Recibido como argumento
                };
    
                // Realizar la solicitud POST
                const response = await axios.post(url, body);
    
                // Si la solicitud fue exitosa, manejar la respuesta aquí
                // Por ejemplo, mostrar un mensaje de éxito
                Swal.fire('Éxito', `La solicitud para ${withdrawMoney === 'N' ? 'capitalizar' : 'retirar'} se ha registrado con éxito.`, 'success');
    
                // Marcar como terminado y realizar cualquier otra acción necesaria
                resetData;
            } catch (error) {
                // Manejar errores aquí
                console.error(`Error al realizar la solicitud de ${withdrawMoney === 'N' ? 'capitalización' : 'retiro'}:`, error);
                Swal.fire('Error', `Hubo un problema al realizar la solicitud de ${withdrawMoney === 'N' ? 'capitalización' : 'retiro'}.`, 'error');
            }
        } else {
            // Mostrar un error si datosSocio es null
            Swal.fire('Error', 'No se han cargado los datos del socio.', 'error');
        }
    };
    
    const handleRetirar = async (event) => {
        event.preventDefault();
        // Llama al nuevo método con 'S' para indicar que el socio desea retirar su utilidad
        await updateWithdrawMoneyByPartnerCod('S');
        setShowActionButtons(false); // Ocultar botones
        setButtonLabel("Limpiar pantalla/Volver a iniciar búsqueda"); // Cambiar etiqueta del botón
        resetData();
    }
    
    const handleCapitalizar = async (event) => {
        event.preventDefault();
        // Llama al nuevo método con 'N' para indicar que el socio desea capitalizar su utilidad
        await updateWithdrawMoneyByPartnerCod('N');
        setShowActionButtons(false); // Ocultar botones
        setButtonLabel("Limpiar pantalla/Volver a iniciar búsqueda"); // Cambiar etiqueta del botón
        resetData();
    }

    const resetData = () => {
        setNumeroSocio('');
        setDatosSocio(null);
        setFinished(false);
        setShowActionButtons(true); // Restablecer la visibilidad de los botones
        setButtonLabel("Obtener Datos de la utilidad!"); // Restablecer la etiqueta del botón principal
      }

    return (
        <div className="block surface-50 h-full m-0" id='utilityAppPrincipalDivID'>
            <img id='utilityAppImgPrincipalDivId' 
                src={`${BASE_URL}/socios/image-background/${BANCARD_COMMERCE_CODE}`}
                alt="Background Image" 
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
            />

            <div className="container pt-4" id='utilityAppContainerId' style={{ position: 'relative', zIndex: 1 }}>
                <Card id='utilityAppCardId' className="surface-50 shadow-none">
                    <h2 id='utilityApH2TitleId' className="text-center">Consulta de utilidad por código de socio / legajo</h2>
                    <form id="utilityAppFormId">
                        {/* Suponiendo que mustSpin, finished, y otras variables están definidas */}
                        <div className="my-3">
                            <div className="formgrid grid flex justify-content-center" id="utilityAppInputsDivId">
                                
                                
                                <div className="field col-12 md:col-3" id="utilityAppInputsBoletaDivId">
                                    <label htmlFor="numeroSocio" className="block mb-2">
                                        <b>Número de socio/ legajo</b>
                                    </label>
                                    <InputNumber
                                        inputId="numeroSocio"
                                        placeholder="Número de socio"
                                        value={numeroSocio}
                                        onValueChange={handleNumeroSocioChange}
                                        useGrouping={false}
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>


                                <br/>
                            </div>
                            <div className="flex justify-content-center flex-wrap" id="utilityAppHandleLotteryDataFetchDivId">
                                <Button label={buttonLabel} onClick={handleConsultaClick}/>
                            </div>

                            {datosSocio && (
                                <div className="card flex flex-column justify-content-center my-4 p-4"
                                    id="utilityAppLotteryDataFetchDivId">
                                    <p><b> Número de socio: </b> {datosSocio.partnerCod}</p>
                                    <p><b> Nombre del socio: </b> {datosSocio.partnerName}</p>
                                    <p><b>Utilidad:</b> Gs. {datosSocio.utility.toLocaleString('es-PY')}</p>
                                    <p>
                                        <b>Respondió:</b> {
                                            datosSocio.withdrawMoney === 'X' ? "Aún no ha respondido la pregunta." :
                                            datosSocio.withdrawMoney === 'S' ? "Ha respondido que SÍ desea retirar su utilidad." :
                                            datosSocio.withdrawMoney === 'N' ? "Ha respondido que desea Capitalizar su utilidad." :
                                            `Comuníquese con un administrador. Valor recibido: ${datosSocio.withdrawMoney}`
                                        }
                                    </p>
                                </div>
                            )}


                            {!finished && datosSocio && datosSocio.withdrawMoney === 'X' && showActionButtons && (
                                <div className="flex justify-content-center flex-wrap button-container">
                                    <Button label="Retirar" icon="pi pi-thumbs-up-fill" onClick={handleRetirar} className="action-button"/>
                                    <Button label="Capitalizar" icon="pi pi-thumbs-up-fill" onClick={handleCapitalizar} className="action-button"/>
                                    <Button label="Cancelar" icon="pi pi-thumbs-up-fill" onClick={resetData} className="action-button"/>
                                </div>
                            )}

                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};