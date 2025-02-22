const categoriesDiv = document.querySelector('.categories');
const productsDiv = document.querySelector('.products');
const paginationDiv = document.querySelector('.pagination');
const loader = document.querySelector('.loader');

let activeCategory = null;
let products = [];
let currentPage = 1;
const itemsPerPage = 6;

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const prevImg = document.getElementById('prevImg');
const nextImg = document.getElementById('nextImg');

let currentImageIndex = 0;
function changeImage(direction) {
    if (direction === 'next') {
        if (currentImageIndex < products.length - 1) {
            currentImageIndex++;
            modalImage.src = products[currentImageIndex].image;
        }
    } else if (direction === 'prev') {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            modalImage.src = products[currentImageIndex].image;
        }
    }
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        changeImage('next');
    } else if (e.key === 'ArrowLeft') {
        changeImage('prev');
    }
});

async function fetchCategories() {
    const res = await fetch('https://fakestoreapi.com/products/categories');
    const categories = await res.json();
    categoriesDiv.innerHTML = '';
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category;
        btn.classList.add('category-btn');
        btn.onclick = () => { activeCategory = category; fetchProducts(); };
        categoriesDiv.appendChild(btn);
    });
}

async function fetchProducts() {
    loader.style.display = 'block';
    productsDiv.innerHTML = '';
    const url = activeCategory 
        ? `https://fakestoreapi.com/products/category/${activeCategory}` 
        : 'https://fakestoreapi.com/products';
    
    const res = await fetch(url);
    products = await res.json();
    loader.style.display = 'none';
    currentPage = 1;
    renderProducts();
}

function renderProducts() {
    productsDiv.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = products.slice(start, start + itemsPerPage);
    
    paginatedProducts.forEach((product, index) => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="100" onclick="openModal(${start + index})">
            <p><strong>${product.title}</strong></p>
            <p>$${product.price.toFixed(2)}</p>
        `;
        productsDiv.appendChild(div);
    });
    renderPagination();
}

function renderPagination() {
    paginationDiv.innerHTML = '';
    const pageCount = Math.ceil(products.length / itemsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('page-btn');
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = () => { currentPage = i; renderProducts(); };
        paginationDiv.appendChild(btn);
    }
}

function openModal(index) {
    modal.style.display = 'block';
    modalImage.src = products[index].image;
    currentImageIndex = index;
}

function closeImageModal() {
    modal.style.display = 'none';
}

function showPrevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        modalImage.src = products[currentImageIndex].image;
    }
}

function showNextImage() {
    if (currentImageIndex < products.length - 1) {
        currentImageIndex++;
        modalImage.src = products[currentImageIndex].image;
    }
}

closeModal.onclick = closeImageModal;
prevImg.onclick = showPrevImage;
nextImg.onclick = showNextImage;

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchProducts();
});
