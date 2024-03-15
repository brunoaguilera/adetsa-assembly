import { useEffect, useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

export const VotoSocio = () => {
    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
    const BANCARD_COMMERCE_CODE = `${import.meta.env.VITE_API_BANCARD_COMMERCE_CODE}`;

    const [numeroSocio, setNumeroSocio] = useState('');
    const [datosSocio, setDatosSocio] = useState(null);
    const [finished, setFinished] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("Buscar Socio!");
    const [showActionButtons, setShowActionButtons] = useState(true);

    const [partnerCodVoto, setPartnerCodVoto] = useState();

    const [candidatos, setCandidatos] = useState([]);

    useEffect(() => {
        loadCandidatos();
    }, []);

    const loadCandidatos = async () => {
        try {
            const url = `${BASE_URL}/socios/candidatos`;
            const response = await axios.get(url);
            setCandidatos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleVotar = async (event) => {
        event.preventDefault()

        console.log("partnerCodVoto: "+ partnerCodVoto);

        if (!partnerCodVoto) {
            let errorMessage = ''
            let headerMessage = 'Info'
            let iconMessage = 'info'
            errorMessage = 'Por favor, debe seleccionar un candidato para votar!'
    
            Swal.fire(headerMessage, errorMessage, iconMessage)
            return;
        }

        updateVotoByPartnerCod(partnerCodVoto);
    }

    const handleConsultaClick = async (event) => {
        event.preventDefault()

        // Si el botón actualmente dice "Limpiar pantalla/Volver a iniciar búsqueda"
        // se resetea la pantalla y se vuelve al estado inicial
        if (buttonLabel === "Limpiar pantalla/Volver a iniciar búsqueda") {
            resetData();
            setButtonLabel("Buscar Socio!");
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
                if (datosSocio && (datosSocio.voto === 'N' || datosSocio.voto === 'S')) {
                    setButtonLabel("Limpiar pantalla/Volver a iniciar búsqueda");
                } else {
                    setShowActionButtons(datosSocio && datosSocio.voto === 'X');
                }
            } catch (error) {
                console.error("Error en voto in ('N', 'S')");
            }
        }

        let errorMessage = ''
        let headerMessage = 'Info'
        let iconMessage = 'info'
        errorMessage = 'La votación ha concluido, muchas gracias!'

        //Swal.fire(headerMessage, errorMessage, iconMessage)
        //return;

        try {
            const url = `${BASE_URL}/socios/partner-cod/${numeroSocio}`;
            const response = await axios.get(url);
            setDatosSocio(response.data);
            // Mostrar botones SI y NO
            // Asegurarte de mostrar u ocultar los botones de acción según el estado de voto
            if (response.data.voto === 'X') {
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

    const updateVotoByPartnerCod = async (partnerCodVoto) => {
        // Asegurarte de que datosSocio no es null para evitar errores
        if (datosSocio) {
            try {
                const url = `${BASE_URL}/socios/actualiza_datos_voto`;
                // Preparar el cuerpo de la solicitud
                const body = {
                    partnerCod: datosSocio.partnerCod,
                    partnerCodVoto: partnerCodVoto, // Recibido como argumento
                };
    
                // Realizar la solicitud POST
                const response = await axios.post(url, body);
    
                // Si la solicitud fue exitosa, manejar la respuesta aquí
                // Por ejemplo, mostrar un mensaje de éxito
                Swal.fire('Éxito', `El voto se ha realizado con éxito`, 'success');
    
                // Marcar como terminado y realizar cualquier otra acción necesaria
                resetData;
            } catch (error) {
                // Manejar errores aquí
                console.error(`Error al realizar el voto`, error);
                Swal.fire('Error', `Hubo un problema al realizar el voto`, 'error');
            }
        } else {
            // Mostrar un error si datosSocio es null
            Swal.fire('Error', 'No se han cargado los datos del socio.', 'error');
        }
    };

    const resetData = () => {
        setNumeroSocio('');
        setDatosSocio(null);
        setFinished(false);
        setPartnerCodVoto(null);
        setCandidatos(null);
        setShowActionButtons(true); // Restablecer la visibilidad de los botones
        setButtonLabel("Buscar Socio!"); // Restablecer la etiqueta del botón principal
    }

    const onInputChange = (event) => {
        const { value } = event.target;
        setPartnerCodVoto(value);
    };

    return (
        <div className="block surface-50 h-full m-0" id='utilityAppPrincipalDivID'>
            <img id='utilityAppImgPrincipalDivId' 
                src={`${BASE_URL}/socios/image-background/${BANCARD_COMMERCE_CODE}`}
                alt="Background Image" 
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
            />

            <div className="container pt-4" id='utilityAppContainerId' style={{ position: 'relative', zIndex: 1 }}>
                <Card id='utilityAppCardId' className="surface-50 shadow-none">
                    <h2 id='utilityApH2TitleId' className="text-center">Introduzca código de socio / legajo para votar</h2>
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
                                    <p><b>RUC:</b> {datosSocio.ruc}</p>
                                    <p>
                                        <b>Información de voto:</b> {
                                            datosSocio.voto === 'X' ? "Aún no ha votado." :
                                            datosSocio.voto === 'S' ? "El socio ya ha votado!" :
                                            datosSocio.voto === 'N' ? "El socio no desea votar!" :
                                            `Comuníquese con un administrador. Valor recibido: ${datosSocio.voto}`
                                        }
                                    </p>
                                </div>
                            )}


                            {!finished && datosSocio && datosSocio.voto === 'X' && showActionButtons && (
                                <div className="flex justify-content-center flex-wrap button-container">
                                    <label htmlFor="candidatoConfigFormSubmitInputChannelIdId">
                                        Escoja su candidato para el voto:
                                    </label>
                                    <select
                                        id="candidatoFormFormSubmitInputChannelCodeId"
                                        className="form-control w-75"
                                        name="partnerCodVoto"
                                        value={partnerCodVoto}
                                        onChange={(event) => {
                                            onInputChange(event);
                                        }}
                                    >
                                        <option value="">Selecciona un candidato</option>
                                        {candidatos.map((candidato) => (
                                            <option key={candidato.partnerCod} value={candidato.partnerCod}>
                                                {`${candidato.partner.partnerName} (${candidato.partnerCod})`}
                                            </option>
                                        ))}
                                    </select>

                                    <Button label="Votar" icon="pi pi-thumbs-up-fill" onClick={handleVotar} className="action-button"/>

                                </div>
                            )}

                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};