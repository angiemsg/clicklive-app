// ==========================
// PROTECCIÓN DE SESIÓN (ORIGINAL)
// ==========================
(function () {

    const usuario = localStorage.getItem("usuario");

    const paginasPublicas = ["login.html", "index.html", "registro.html"];
    const paginaActual = window.location.pathname.split("/").pop();

    if (!usuario && !paginasPublicas.includes(paginaActual)) {
        window.location.href = "login.html";
    }

})();

// =======================
//  INICIO GLOBAL (todas las pantallas)
// =======================

window.onload = function () {

    const usuario = localStorage.getItem("usuario");
    const foto = localStorage.getItem("foto");
    const redesGuardadas = JSON.parse(localStorage.getItem("redes") || "[]");

    if (usuario && document.getElementById("nombreUsuarioTexto")) {
        document.getElementById("nombreUsuarioTexto").innerText = usuario;
    }

    if (foto && document.getElementById("preview")) {
        document.getElementById("preview").src = foto;
    }

    if (usuario && document.getElementById("usuarioTexto")) {
        document.getElementById("usuarioTexto").innerText = usuario;
    }

    if (foto && document.getElementById("fotoDashboard")) {
        document.getElementById("fotoDashboard").src = foto;
    }

    if (redesGuardadas.length > 0) {
        redesSeleccionadas = redesGuardadas;

        const iconos = document.querySelectorAll(".redes-grid img");

        iconos.forEach(icono => {
            const red = icono.getAttribute("data-red");
            if (redesSeleccionadas.includes(red)) {
                icono.classList.add("activa");
            }
        });
    }
};
/ =======================
// FIN GLOBAL
// =======================


// =======================
// INICIO LOGIN
// =======================
function login() {
    const usuarioInput = document.getElementById("usuario");
    const passwordInput = document.querySelector('input[type="password"]');

    if (!usuarioInput || !passwordInput) {
        mostrarToast("Error en los inputs", "error");
        return;
    }

    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    const savedUser = localStorage.getItem("usuario");
    const savedPass = localStorage.getItem("password");

    if (usuario === "" || password === "") {
        mostrarToast("Completa todos los campos", "error");
        return;
    }

    if (!savedUser || !savedPass) {
        mostrarToast("Primero debes crear una cuenta", "error");
        return;
    }

    if (savedUser !== usuario) {
        mostrarToast("Usuario incorrecto", "error");
        return;
    }

    if (savedPass !== password) {
        mostrarToast("Contraseña incorrecta", "error");
        return;
    }

    // LOGIN OK
    mostrarToast("✨ Bienvenido " + usuario, "ok");

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1200);
}
// =======================
// FIN LOGIN
// =======================


// =======================
// INICIO REGISTRO
// =======================
function registro() {
    const usuarioInput = document.getElementById("usuario");
    const passwordInput = document.getElementById("password");
    const confirmarInput = document.getElementById("confirmar");
    const terminos = document.getElementById("terminos");

    if (!usuarioInput || !passwordInput || !confirmarInput) {
        alert("Error en inputs");
        return;
    }

    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmar = confirmarInput.value.trim();

    if (usuario === "" || password === "" || confirmar === "") {
        mostrarToast("Completa todos los campos");
        return;
    }

    if (password !== confirmar) {
        mostrarToast("Las contraseñas no coinciden");
        return;
    }

    if (!terminos.checked) {
        mostrarToast("Debes aceptar los términos");
        return;
    }

    localStorage.setItem("usuario", usuario);
    localStorage.setItem("password", password);

    mostrarToast("Cuenta creada correctamente");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}
// =======================
// FIN REGISTRO
// =======================


//========================
// INICIO MENÚ
//========================
 function abrirMenu() {
     const menu = document.getElementById("menuOverlay");
     if (menu) {
         menu.style.transform = "translateX(0)";
     }
 }

 function cerrarMenu() {
     const menu = document.getElementById("menuOverlay");
     if (menu) {
         menu.style.transform = "translateX(100%)";
     }
 }

 // LOGOUT

 function logout() {
     try {
         // Eliminar solo la sesión activa
         localStorage.removeItem("sesionActiva");

         // Cerrar menú si está abierto
         cerrarMenu();

         // Redirigir al login
         window.location.href = "login.html";

     } catch (error) {
         console.error("Error al cerrar sesión:", error);
     }
 }

 // Alias (por si lo llamas desde HTML)
 function cerrarSesion() {
     logout();
 }

 // FUNCIONES TEMPORALES (FASE ACTUAL)
 function fase2() {
     alert("Funcionalidad disponible próximamente");
 }
 //========================
 // FIN MENU
 //========================



// =======================
// INICIO DASHBOARD (dashboard.html)
// =======================

//  CARGAR DATOS PERFIL
window.addEventListener("DOMContentLoaded", () => {
    const nombre = localStorage.getItem("usuario");
    const foto = localStorage.getItem("foto");

    //  nombre
    const nombreElemento = document.querySelector(".usuario-dashboard");
    if (nombre && nombreElemento) {
        nombreElemento.textContent = nombre;
    }

    //  foto
    const fotoElemento = document.querySelector(".foto-container img");
    if (foto && fotoElemento) {
        fotoElemento.src = foto;
    }
});
// =======================
// FIN DASHBOARD
// =======================


// =======================
// INICIO PERFIL
// =======================
let redesSeleccionadas = [];

function toggleRed(elemento) {
    if (!elemento) return;

    const red = elemento.getAttribute("data-red");
    elemento.classList.toggle("activa");

    if (redesSeleccionadas.includes(red)) {
        redesSeleccionadas = redesSeleccionadas.filter(r => r !== red);
    } else {
        redesSeleccionadas.push(red);
    }
}

function guardarPerfil() {
    if (redesSeleccionadas.length === 0) {
        alert("Selecciona al menos una red");
        return;
    }

    // ASEGURA QUE TODO SE GUARDE ANTES DE SALIR
    const nombre = document.getElementById("nombreUsuarioTexto").textContent;
    const foto = document.getElementById("preview").src;

    localStorage.setItem("usuario", nombre);
    localStorage.setItem("foto", foto);
    localStorage.setItem("redes", JSON.stringify(redesSeleccionadas));

    window.location.href = "dashboard.html";
}

function cargarFoto(event) {
    const preview = document.getElementById("preview");
    if (!preview) return;

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
        preview.src = reader.result;
        localStorage.setItem("foto", reader.result);
    };

    reader.readAsDataURL(file);
}

function editarNombre() {
    const input = document.getElementById("nombreUsuarioInput");
    const texto = document.getElementById("nombreUsuarioTexto");
    if (!input || !texto) return;

    if (input.style.display === "block") {

        if (input.value.trim() !== "") {
            localStorage.setItem("usuario", input.value.trim());
            texto.innerText = input.value.trim();
        }

        input.style.display = "none";
        texto.style.display = "block";

    } else {
        input.style.display = "block";
        texto.style.display = "none";

        input.value = localStorage.getItem("usuario") || "";
        input.focus();
    }
}
// =======================
//  FIN PERFIL
// =======================


// =======================
// INICIO ARCHIVOS
// =======================
document.addEventListener("DOMContentLoaded", function () {

    const inputArchivo = document.getElementById("inputArchivo");
    const contenedorArchivos = document.querySelector(".grid-archivos");
    const emptyState = document.getElementById("emptyState");

    function actualizarEmpty() {
        if (!emptyState) return;
        emptyState.style.display =
            contenedorArchivos.children.length === 0 ? "block" : "none";
    }

    actualizarEmpty();

    //  ÚNICA FORMA DE ABRIR SELECTOR
    const btnDispositivo = document.querySelector(".acciones-archivos .accion");

    if (btnDispositivo && inputArchivo) {
        btnDispositivo.addEventListener("click", () => {
            inputArchivo.value = "";
            inputArchivo.click();
        });
    }

    // BOTONES NUBE
    const btnNube = document.querySelector(".acciones-archivos div:nth-child(2)");
    const btnSubir = document.querySelector(".acciones-archivos div:nth-child(3)");

    if (btnNube) {
        btnNube.addEventListener("click", () => {
            mostrarToastFase2("Desde la nube");
        });
    }

    if (btnSubir) {
        btnSubir.addEventListener("click", () => {
            mostrarToastFase2("Subir a la nube");
        });
    }

    // STORAGE
    let archivosGuardados = JSON.parse(localStorage.getItem("archivos")) || [];

    archivosGuardados.forEach(renderArchivo);
    actualizarEmpty();

    // SUBIR ARCHIVOS
    inputArchivo.addEventListener("change", function () {

        const archivos = inputArchivo.files;

        for (let archivo of archivos) {

            if (
                !archivo.type.startsWith("image/") &&
                !archivo.type.startsWith("video/")
            ) continue;

            const url = URL.createObjectURL(archivo);

            const data = {
                nombre: archivo.name,
                tipo: archivo.type,
                url: url
            };

            archivosGuardados.push(data);
            renderArchivo(data);
        }

        localStorage.setItem("archivos", JSON.stringify(archivosGuardados));

        inputArchivo.value = null;
        actualizarEmpty();
    });

    function renderArchivo(archivo) {

        const div = document.createElement("div");
        div.classList.add("archivo-item");

        let media;

        if (archivo.tipo.startsWith("image/")) {
            media = document.createElement("img");
        } else {
            media = document.createElement("video");
            media.controls = true;
        }

        media.src = archivo.url;
        media.classList.add("img-archivo");

        const eliminar = document.createElement("button");
        eliminar.classList.add("btn-eliminar");
        eliminar.innerHTML = "🗑";

        eliminar.addEventListener("click", function (e) {
            e.stopPropagation();
            div.remove();

            archivosGuardados = archivosGuardados.filter(a => a.url !== archivo.url);
            localStorage.setItem("archivos", JSON.stringify(archivosGuardados));

            actualizarEmpty();
        });

        const nombre = document.createElement("p");
        nombre.textContent = archivo.nombre;

        div.appendChild(media);
        div.appendChild(eliminar);
        div.appendChild(nombre);

        contenedorArchivos.appendChild(div);
    }

    // BUSCADOR
    const botonBuscar = document.querySelector(".buscador button");
    const inputBuscar = document.querySelector(".buscador input");

    function buscarArchivos() {
        const texto = inputBuscar.value.toLowerCase();
        const archivos = document.querySelectorAll(".archivo-item");

        archivos.forEach(function (archivo) {
            const nombre = archivo.querySelector("p").textContent.toLowerCase();
            archivo.style.display = nombre.includes(texto) ? "block" : "none";
        });
    }

    botonBuscar.addEventListener("click", buscarArchivos);

    inputBuscar.addEventListener("keypress", function (e) {
        if (e.key === "Enter") buscarArchivos();
    });

    // APPS
    const apps = document.querySelectorAll(".app-item");

    apps.forEach(function (app) {
        app.addEventListener("click", function () {
            const nombre = app.querySelector("p").textContent;
            mostrarToastFase2(nombre);
        });
    });

});

function mostrarToastFase2(nombre) {

    const toast = document.getElementById("toast");

    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="
                width:30px;
                height:30px;
                border-radius:50%;
                background:#5fd14f;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:16px;
            ">🚧</div>
            <div>
                <strong>${nombre}</strong><br>
                <span style="font-size:11px; opacity:0.8;">
                    Se implementará en fase 2 del proyecto
                </span>
            </div>
        </div>
    `;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
// =======================
// FIN ARCHIVOS
// =======================


// =======================
//INICIO CALENDARIO
// =======================
let diaActivo = null;
let archivoSeleccionado = null;
let eventos = JSON.parse(localStorage.getItem("eventos")) || {};

document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("contenedorCalendarios");
    if (!contenedor) return;

    const hoy = new Date();

    // GENERAR MESES
    for (let i = 0; i < 6; i++) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
        generarMes(contenedor, fecha);
    }

    //  BUSCADOR DE MESES (NUEVO)
    const buscador = document.getElementById("buscadorMes");

    if (buscador) {
        buscador.addEventListener("input", function () {

            const valor = buscador.value.toLowerCase().trim();

            if (valor === "") return;

            const mes = document.getElementById("mes-" + valor);

            if (mes) {
                mes.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }

    // ARCHIVO (preview)
    const inputArchivo = document.getElementById("archivoPost");
    const preview = document.getElementById("previewContainer");

    if (inputArchivo) {
        inputArchivo.addEventListener("change", function () {

            const archivo = this.files[0];
            archivoSeleccionado = archivo;

            preview.innerHTML = "";

            if (!archivo) return;

            const url = URL.createObjectURL(archivo);

            if (archivo.type.startsWith("image/")) {
                preview.innerHTML = `<img src="${url}" style="width:100%;border-radius:10px;">`;
            }

            if (archivo.type.startsWith("video/")) {
                preview.innerHTML = `<video src="${url}" controls style="width:100%;border-radius:10px;"></video>`;
            }

        });
    }

});

// GENERAR MES
function generarMes(contenedor, fecha) {

    const mes = fecha.getMonth();
    const año = fecha.getFullYear();

    const meses = [
        "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
        "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"
    ];

    const bloque = document.createElement("div");
    bloque.classList.add("mes-bloque");

    // ID PARA BUSCADOR (NUEVO)
    const nombreMes = meses[mes].toLowerCase();
    bloque.id = "mes-" + nombreMes;

    bloque.innerHTML = `
        <div class="mes-titulo">${meses[mes]} ${año}</div>
        <div class="dias-semana">
            <div>DOM</div><div>LUN</div><div>MAR</div>
            <div>MIE</div><div>JUE</div><div>VIE</div><div>SAB</div>
        </div>
        <div class="calendario-grid"></div>
    `;

    const grid = bloque.querySelector(".calendario-grid");

    const primerDia = new Date(año, mes, 1).getDay();
    const diasMes = new Date(año, mes + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) {
        const vacio = document.createElement("div");
        vacio.classList.add("dia", "vacio");
        grid.appendChild(vacio);
    }

    for (let i = 1; i <= diasMes; i++) {

        const dia = document.createElement("div");
        dia.classList.add("dia");

        const key = `${año}-${mes}-${i}`;
        dia.dataset.key = key;

        dia.innerHTML = `<span class="numero">${i}</span>`;

        dia.addEventListener("click", () => {

            diaActivo = dia;

            abrirModal();

            if (eventos[key]) {
                mostrarEventos(key);
            }

        });

        grid.appendChild(dia);
    }

    contenedor.appendChild(bloque);
}

// MODAL
function abrirModal() {

    document.getElementById("textoPost").value = "";
    document.getElementById("previewContainer").innerHTML = "";
    document.getElementById("archivoPost").value = "";

    archivoSeleccionado = null;

    document.getElementById("modalContenido").style.display = "flex";
}

function cerrarModal() {

    document.getElementById("modalContenido").style.display = "none";

    document.getElementById("textoPost").value = "";
    document.getElementById("previewContainer").innerHTML = "";
    document.getElementById("archivoPost").value = "";

    archivoSeleccionado = null;
}

// GUARDAR EVENTO
function guardarContenido() {

    if (!diaActivo) return;

    const red = document.getElementById("redPost").value;
    const hora = document.getElementById("horaPost").value;

    const key = diaActivo.dataset.key;

    if (!eventos[key]) {
        eventos[key] = [];
    }

    eventos[key].push({
        red,
        hora,
        media: archivoSeleccionado ? {
            url: URL.createObjectURL(archivoSeleccionado),
            tipo: archivoSeleccionado.type
        } : null
    });

    diaActivo.classList.add("activo");

    cerrarModal();
}

// MOSTRAR EVENTOS
function mostrarEventos(key) {

    const lista = eventos[key];
    const preview = document.getElementById("previewContainer");

    preview.innerHTML = `
        <div style="max-height:300px; overflow-y:auto;">
            <h4>Eventos del día</h4>
            <div id="listaEventos"></div>
        </div>
    `;

    const contenedor = document.getElementById("listaEventos");

    lista.forEach((e, index) => {

        let mediaHTML = "";

        if (e.media) {
            if (e.media.tipo.startsWith("video")) {
                mediaHTML = `<video src="${e.media.url}" controls style="width:100%;border-radius:8px;"></video>`;
            } else {
                mediaHTML = `<img src="${e.media.url}" style="width:100%;border-radius:8px;">`;
            }
        }

        contenedor.innerHTML += `
            <div style="margin-bottom:10px; background:#1a1a1a; padding:10px; border-radius:10px;">
                <div><strong>${e.red}</strong> - ${e.hora}</div>
                ${mediaHTML}
                <button onclick="eliminarEvento('${key}', ${index})" style="margin-top:5px;">Eliminar</button>
            </div>
        `;
    });

    preview.innerHTML += `
        <button onclick="cerrarModal()" style="margin-top:10px; width:100%;">Cerrar</button>
    `;
}

// ELIMINAR EVENTO
function eliminarEvento(key, index) {

    eventos[key].splice(index, 1);

    if (eventos[key].length === 0) {
        delete eventos[key];

        const dia = document.querySelector(`[data-key="${key}"]`);
        if (dia) dia.classList.remove("activo");
    }

    mostrarEventos(key);
}
// =======================
// FIN CALENDARIO
// =======================


// =======================
// INICIO METRICAS
// =======================
//VOLVER
function volver() {
    window.location.href = "dashboard.html";
}

// MENSAJES POR RED
function mensajeRed(red) {

    switch (red) {

        case "Instagram":
            mostrarToast("📊 Estás actualmente en Instagram");
            break;

        case "Facebook":
            mostrarToast("🚧 Facebook disponible en Fase 2");
            break;

        case "TikTok":
            mostrarToast("🚧 TikTok disponible en Fase 2");
            break;

        case "YouTube":
            mostrarToast("🚧 YouTube disponible en Fase 2");
            break;

        case "X":
            mostrarToast("🚧 X disponible en Fase 2");
            break;

        default:
            mostrarToast("🚧 Threads disponible en Fase 2");
    }
}

// TOAST MENSAJE 
function mostrarToast(msg) {

    const toast = document.getElementById("toast");

    //  seguridad por si no existe
    if (!toast) return;

    toast.innerText = msg;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
// =======================
//  FIN METRICAS
// =======================


// =======================
// BLOCK DE NOTAS
// =======================

document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("contenedorNotas");
    if (!contenedor) return;

    const btnAgregar = document.getElementById("btnAgregar");
    const modal = document.getElementById("modal");
    const estadoVacio = document.getElementById("estadoVacio");

    function verificarEstadoVacio() {
        const hayNotas = contenedor.querySelectorAll(".nota").length > 0;
        estadoVacio.style.display = hayNotas ? "none" : "block";
    }

    // ABRIR MODAL
    btnAgregar.addEventListener("click", function () {
        modal.classList.add("activo");
    });

    // CERRAR MODAL
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.classList.remove("activo");
        }
    });

    // GUARDAR NOTA
    document.addEventListener("click", function (e) {

        if (e.target && e.target.id === "btnGuardar") {

            const textoNota = document.getElementById("textoNota");
            const texto = textoNota.value.trim();

            if (texto === "") return;

            const nota = document.createElement("div");
            nota.className = "nota";

            nota.innerHTML = `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    background:#1f1f1f;
                    padding:12px;
                    border-radius:12px;
                    margin-bottom:10px;
                    color:white;
                ">
                    <span>${texto}</span>

                    <button onclick="eliminarNota(this)" style="
                        background:none;
                        border:none;
                        color:#5fd14f;
                        font-size:18px;
                    ">×</button>
                </div>
            `;

            contenedor.prepend(nota);

            textoNota.value = "";
            modal.classList.remove("activo");

            verificarEstadoVacio();
        }
    });

    verificarEstadoVacio();

});

// ELIMINAR → PAPELERA

function eliminarNota(btn) {

    const nota = btn.closest(".nota");
    const texto = nota.querySelector("span").innerText.trim();

    let papelera = JSON.parse(localStorage.getItem("papeleraNotas")) || [];

    papelera.push(texto);

    localStorage.setItem("papeleraNotas", JSON.stringify(papelera));

    nota.remove();
}

//  IMPORTANTE PARA ANDROID
window.eliminarNota = eliminarNota;

// =======================
// FIN BLOCK DE NOTAS
// =======================