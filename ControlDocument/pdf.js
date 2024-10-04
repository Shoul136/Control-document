const url = './pdf/Shims Calculator V 3.0docx.pdf';  // Ruta al archivo PDF
let pdfDoc = null;
let currentPage = 1;
let scale = 1.5;
const viewer = document.getElementById('viewer');
const currentPageDisplay = document.getElementById('currentPage');
const totalPagesDisplay = document.getElementById('totalPages');
const modal_viewer = document.querySelector('#modal_viewer_pdf')

// Cargar el PDF
pdfjsLib.getDocument(url).promise.then(function(pdf) {
    pdfDoc = pdf;
    totalPagesDisplay.textContent = pdf.numPages;
    renderPage(currentPage);
});

// Renderizar una página
function renderPage(pageNum) {
    pdfDoc.getPage(pageNum).then(function(page) {
        const viewport = page.getViewport({scale: scale});

        // Limpiar el visor
        viewer.innerHTML = '';

        // Crear y configurar el canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Renderizar la página en el canvas
        page.render({
            canvasContext: context,
            viewport: viewport
        });

        viewer.appendChild(canvas);
        currentPageDisplay.textContent = pageNum;
    });
}

// Función para cambiar de página
function goToPage(pageNum) {
    if (pageNum >= 1 && pageNum <= pdfDoc.numPages) {
        currentPage = pageNum;
        renderPage(currentPage);
    }
}

// Control de botones de navegación
document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
});

document.getElementById('nextPage').addEventListener('click', function() {
    if (currentPage < pdfDoc.numPages) {
        goToPage(currentPage + 1);
    }
});

// Control de zoom
document.getElementById('zoomIn').addEventListener('click', function() {
    scale += 0.1;
    renderPage(currentPage);
});

document.getElementById('zoomOut').addEventListener('click', function() {
    if (scale > 0.5) {
        scale -= 0.1;
        renderPage(currentPage);
    }
});

document.getElementById('zoomLevel').addEventListener('change', function() {
    const newScale = parseFloat(this.value);
    if (newScale >= 0.5 && newScale <= 3) {
        scale = newScale;
        renderPage(currentPage);
    }
});

modal_viewer.addEventListener('contextmenu', function(e){
    e.preventDefault();
    return false;
})

document.addEventListener('keydown', function(e){
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault(); // Bloquea la acción predeterminada
        return false;
    }
})