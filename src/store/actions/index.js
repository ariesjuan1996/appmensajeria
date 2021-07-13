

  export function actualizarLoader(data) {
    return { type: "ACTUALIZARLOADER", loaderData: data };
  }
  export function actualizarLoaderHome(data) {
    return { type: "ACTUALIZARLOADERHOME", loaderHome: data };
  }

  export function actualizarDataUsuarioTelefono(data) {
    return { type: "ACTUALIZARDATAUSUARIOTELEFONO", dataUsuarioTelefono: data };
  }
  export function actualizarListadoContactos(data) {
    return { type: "ACTUALIZARDATALISTADOCONTACTOS", listadoContactosTotal: data };
  }
  export function actualizarListadoUsuarioVista(data) {
    return { type: "ACTUALIZARDATALISTADOUSUARIOVISTA", listadoUsuarioVista: data };
  }