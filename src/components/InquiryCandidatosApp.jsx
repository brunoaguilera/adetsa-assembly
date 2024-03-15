import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Card } from "primereact/card";
import * as XLSX from 'xlsx';

export const InquiryCandidatosApp = () => {
  const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
  const BANCARD_COMMERCE_CODE = `${import.meta.env.VITE_API_BANCARD_COMMERCE_CODE}`;

  const [queryData, setQueryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleQuery = async (event) => {
    event.preventDefault();

    let errorMessage = "Ocurrió un error en el servidor web";
    let headerMessage = "Error";
    let iconMessage = "error";
    try {
      const url = `${BASE_URL}/socios/candidatos`;
      console.log("url:", url);
      const response = await axios.get(url);

      console.info("response:", response);

      if (response.status) {
        setQueryData(response.data);
        if (response.data.length === 0) {
          errorMessage = `No existen registros de candidatos`;
          headerMessage = "Informativo";
          iconMessage = "info";
          Swal.fire(headerMessage, errorMessage, iconMessage);
        }
      } else {
        setQueryData([]);
        errorMessage = "Ocurrió un error en el servidor web";
        headerMessage = "Error";
        iconMessage = "error";
        Swal.fire(headerMessage, errorMessage, iconMessage);
      }
    } catch (error) {
      console.error("Error del try: " + error + " ");
      headerMessage = "Informativo";
      iconMessage = "info";
      errorMessage = "No se han encontrado candidatos para la consulta";
      Swal.fire(headerMessage, errorMessage, iconMessage);
    }
  };

  const handleDownloadCsv = () => {
    // Crear el contenido del CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Codigo;Nombre;CantidadVotos\n"; // Agregar cabecera con punto y coma como separador

    // Agregar los datos
    queryData.forEach(item => {
        const row = [
            `="${item.partnerCod}"`, // Formatear partnerCod como texto
            item.partner.partnerName,
            item.cantidadVotos
        ].join(";"); // Usar punto y coma como separador de campos
        csvContent += row + "\n";
    });

    // Crear un enlace para descargar el archivo
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "datos_votaciones.csv");
    document.body.appendChild(link); // Necesario para Firefox

    // Descargar el archivo
    link.click();

    // Limpiar (opcional)
    document.body.removeChild(link);
}

const handleDownloadExcel = () => {
  // Crear un nuevo libro de trabajo y una hoja
  const wb = XLSX.utils.book_new();
  const wsName = "DatosVotaciones";

  // Preparar los datos para la hoja
  const wsData = [
      ["Codigo", "Nombre", "CantidadVotos"], // Encabezados
      // Datos (transformar cada item en un array de sus valores)
      ...queryData.map(item => [
          `'${item.partnerCod}`, // Agregar una comilla simple al inicio para forzar texto
          item.partner.partnerName,
          item.cantidadVotos,
      ])
  ];

  // Crear la hoja a partir de los datos y añadirla al libro de trabajo
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, wsName);

  // Generar el archivo Excel y simular su descarga
  XLSX.writeFile(wb, "datos_votaciones.xlsx");
};


  return (
    <div className="block surface-50 h-screen m-0" id="inquiryAppPrincipalDivID">
      <img
        id="inquiryAppImgPrincipalDivId"
        src={`${BASE_URL}/socios/image-background/${BANCARD_COMMERCE_CODE}`}
        alt="Background Image"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        className="container pt-4"
        id="inquiryAppContainerId"
        style={{ position: "relative", zIndex: 1 }}
      >
        <Card id="inquiryAppCardId" className="surface-50 shadow-none">
          <h2>Consulta de candidatos</h2>

          <form id="inquiryAppFormId">

          <div className="narrow-box">
             <div className="input-group mb-3">
                <div className="input-group-append" id="inquiryListDivId">
                <button
                    className="btn btn-primary mx-2"
                    id="inquiryListButtonId"
                    variant="primary"
                    onClick={handleQuery}
                >
                    Consultar
                </button>

                {queryData.length > 0 && (
                    <button className="btn btn-secondary" onClick={handleDownloadExcel}>
                        Descargar Datos en Excel
                    </button>
                )}

                {queryData.length > 0 && (
                    <button className="btn btn-secondary" onClick={handleDownloadCsv}>
                        Descargar Datos en CSV
                    </button>
                )}
                </div>
             </div>

                {queryData.length > 0 && (
                    <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                )}
            </div>


            {queryData.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Cantidad Votos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryData
                      .filter((item) => {
                        // Filtrar los elementos según el término de búsqueda
                        const searchFields = [
                          item.partnerCod,
                          item.partner.partnerName,
                          item.cantidadVotos,
                        ];
                        return searchFields
                          .join(" ")
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      })
                      .map((item) => (
                        <tr key={item.partnerCod}>
                          <td>{item.partnerCod}</td>
                          <td>{item.partner.partnerName}</td>
                          <td>{item.cantidadVotos}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};