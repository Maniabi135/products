let allProducts = [];
let displayedProducts = [];
let productsToDisplay = 10;
let filteredProducts = [];
let loading = true;

const categories = [
  { id: "jewelery", label: "Jewelery" },
  { id: "electronics", label: "Electronics" },
  { id: "men's clothing", label: "Men's Clothing" },
  { id: "women's clothing", label: "Women's Clothing" },
];

function renderCategories(containerId, type="") {
  const container = document.getElementById(containerId);
  categories.forEach((category) => {
    const listItem = document.createElement("li");
    listItem.classList.add("filter-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `${category.id}${type||""}`;
    checkbox.classList.add("filter-checkbox");
    checkbox.name = `category${type? "-mobile":""}`;
    checkbox.value = category.id;

    const label = document.createElement("label");
    label.setAttribute("for", `${category.id}${type||""}`);
    label.classList.add("filter-label");
    label.textContent = category.label;

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    container.appendChild(listItem);
  });
}

renderCategories("categoriesDesktop");
renderCategories("categoriesDropdown", "mobile");

function productLoader() {
  const loaders = Array.from(
    { length: 10 },
    () => `
            <li class="product-item-loader">
                <div class="product-img shimmer"></div>
                <div class="product-content">
                    <div class="product-title shimmer"></div>
                    <div class="product-price shimmer"></div>
                    <div class="product-whistlist shimmer"></div>
                </div>
            </li>
        `
  ).join("");
  return loaders;
}

function fetchProducts() {
  loading = true;
  const productsContainer = document.getElementById("productsList");
  const loaders = productLoader();
  document.getElementById("pageLoader").style.display = "none";
  productsContainer.innerHTML = loaders;

  document.getElementById("loadMore").innerText = "Loading...";
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      allProducts = data;
      applyFilters();
      document.getElementById("loadMore").innerText = "Load More"; // Reset button text
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      document.getElementById("loadMore").innerText = "Error Loading Products";
    })
    .finally(() => {
      document.getElementById("loadMore").style.display = "block";
      loading = false;
    });
}

function displayProducts(products) {
  const productsContainer = document.getElementById("productsList");
  productsContainer.innerHTML = "";
  document.getElementById("loadMore").style.display = "block";
  products.forEach((product) => {
    const productCard = `
    <li class="product-item">
        <img src="${product.image}" alt="${product.title}" class="product-img" />
            <div class="product-content">
                <h4 class="product-title">${product.title}</h4>
                <p class="product-price">$ ${product.price}</p>
                                <span class="material-symbols-outlined product-whistlist">
                                    favorite
                                </span>
                            </div>
                        </li>`;
    productsContainer.innerHTML += productCard;
  });
  document.getElementById("resultsCount").innerText = `${
    products.length
  } Result${products.length > 1 ? "s" : ""}`;
  toggleLoadMoreButton();
}

function applyFilters(type = "") {
  filteredProducts = allProducts;
  // Filter by category
  const selectedCategories = Array.from(
    document.querySelectorAll(
      `input[name="category${type ? "-mobile" : ""}"]:checked`
    )
  ).map((cb) => cb.value);
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedCategories.includes(product.category)
    );
  }

  // Search by name
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  if (searchInput) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchInput)
    );
  }

  // Sort by price
  const sortOption = document.getElementById("sortByPrice").value;
  if (sortOption === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  displayedProducts = filteredProducts.slice(0, productsToDisplay);
  displayProducts(displayedProducts);
}

function loadMore() {
  if (!loading) {
    const productsContainer = document.getElementById("productsList");
    const loaders = productLoader();
    productsContainer.innerHTML += loaders;
    document.getElementById("loadMore").style.display = "none";
    setTimeout(() => {
      productsToDisplay += 10;
      applyFilters();
    }, 3500);
  }
}

function toggleMobileCategoryDropdown() {
  const dropdown = document.getElementById("filterDropdown");
  const dropdownOverlay = document.getElementById("filterOverlay");

  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
    dropdownOverlay.style.display = "none";
  } else {
    dropdown.style.display = "block";
    dropdownOverlay.style.display = "block";
  }
}

function handleClickOutside() {
  document.getElementById("filterDropdown").style.display = "none";
  document.getElementById("filterOverlay").style.display = "none";
  document.removeEventListener("click", handleClickOutside);
}

function toggleLoadMoreButton() {
  const remainingProducts = filteredProducts.length - productsToDisplay;
  if (remainingProducts > 0) {
    document.getElementById("loadMore").style.display = "block";
  } else {
    document.getElementById("loadMore").style.display = "none";
  }
}

function openMenuBar() {
  document.body.style.overflow = "hidden";
  document.getElementById("menuBar").innerHTML = "menu_open";
  document.getElementById("tabs").classList.add("show-menu-list-dropdown");
}

function closeMenuBar() {
  document.body.style.overflow = "unset";
  document.getElementById("menuBar").innerHTML = "menu";
  document.getElementById("tabs").classList.remove("show-menu-list-dropdown");
}

window.onload = function () {
  fetchProducts();
  document.querySelectorAll('input[name="category"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => applyFilters());
  });
  document
    .querySelectorAll('input[name="category-mobile"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () => applyFilters("mobile"));
    });
  document
    .getElementById("sortByPrice")
    .addEventListener("change", () => applyFilters());
  document.getElementById("loadMore").addEventListener("click", loadMore);
  document
    .getElementById("filterByCategory")
    .addEventListener("click", toggleMobileCategoryDropdown);
  document
    .getElementById("filterOverlay")
    .addEventListener("click", handleClickOutside);

  document.getElementById("menuBar").addEventListener("click", openMenuBar);
  document
    .getElementById("closeMenuBar")
    .addEventListener("click", closeMenuBar);
};
