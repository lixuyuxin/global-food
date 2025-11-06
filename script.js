const initialRecipes = [
  {country:"Italy", title:"Spaghetti Bolognese", img:"images/Spaghetti Bolognese.png", ingredients:["Spaghetti 200g","Ground beef 300g","Tomato 400g","Onion 1","Garlic 2 cloves"], steps:"1. Finely chop onion & garlic, sauté. 2. Add beef, brown. 3. Add tomatoes, simmer. 4. Serve with spaghetti."},
  {country:"Italy", title:"Margherita Pizza", img:"images/Margherita Pizza.png", ingredients:["Pizza dough","Tomato sauce","Mozzarella","Basil"], steps:"Bake at high heat until golden."},
  {country:"Japan", title:"Chicken Ramen", img:"images/Chicken Ramen.png", ingredients:["Ramen noodles","Chicken","Miso","Stock"], steps:"Assemble hot bowl with toppings."},
  {country:"Japan", title:"Salmon Sushi Roll", img:"images/Salmon Sushi Roll.png", ingredients:["Sushi rice","Nori","Salmon","Cucumber"], steps:"Roll and slice."},
  {country:"China", title:"Kung Pao Chicken", img:"images/Kung Pao Chicken.png", ingredients:["Chicken","Peanuts","Dried chili","Soy sauce"], steps:"Stir-fry with sauce."},
  {country:"China", title:"Hand-pulled Noodles", img:"images/Hand-pulled Noodles.png", ingredients:["Flour","Water","Salt"], steps:"Knead, rest, pull, cook."},
  {country:"Thailand", title:"Pad Thai", img:"images/Pad Thai.png", ingredients:["Rice noodles","Shrimp","Tamarind","Peanuts"], steps:"Stir-fry & finish with peanuts."},
  {country:"Thailand", title:"Tom Yum Soup", img:"images/Tom Yum Soup.png", ingredients:["Shrimp","Lemongrass","Galangal"], steps:"Simmer aromatics & shrimp."},
  {country:"France", title:"Coq au Vin", img:"images/Coq au Vin.png", ingredients:["Chicken","Red wine","Mushrooms"], steps:"Marinate and braise."},
  {country:"France", title:"Crème Brûlée", img:"images/Crème Brûlée.png", ingredients:["Cream","Egg yolks","Vanilla","Sugar"], steps:"Bake in bain-marie and torch sugar."},
  {country:"Mexico", title:"Tacos al Pastor", img:"images/Tacos al Pastor.png", ingredients:["Pork","Pineapple","Tortillas"], steps:"Grill and serve in tortillas."},
  {country:"Mexico", title:"Churros", img:"images/Churros.png", ingredients:["Flour","Water","Eggs","Sugar"], steps:"Fry dough and roll in cinnamon sugar."}
];

const STORAGE_KEY = 'recipes_v1';
let slideIndex = 0;
let autoTimer = null;

function getRecipes() {
  return JSON.parse(JSON.stringify(initialRecipes));
}

function escapeHtml(str) {
  return String(str||'').replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"').replace(/'/g,'&#39;');
}

/* Slideshow */
function initSlides() {
  slideIndex = 0;
  updateSlide();
  resetAuto();
}

function updateSlide() {
  const slides = document.querySelectorAll('.slideshow .slide');
  if (slides.length === 0) return;
  
  slides.forEach(slide => slide.classList.remove('active'));
  slides[slideIndex].classList.add('active');
}

function changeSlide(dir) {
  const slides = document.querySelectorAll('.slideshow .slide');
  if (slides.length === 0) return;
  
  slideIndex += dir;
  if (slideIndex >= slides.length) slideIndex = 0;
  if (slideIndex < 0) slideIndex = slides.length - 1;
  
  updateSlide();
  resetAuto();
}

function resetAuto() {
  if(autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(() => changeSlide(1), 5000);
}

/* Page Navigation */
function showPage(pageId) {
  document.querySelectorAll('.page-content').forEach(page => {
    page.classList.remove('active');
  });
  
  const targetPage = document.getElementById(pageId + '-page');
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) {
      link.classList.add('active');
    }
  });
  
  if (pageId === 'home') {
    initSlides();
    loadPreviewRecipes();
  } else if (pageId === 'recipes') {
    renderRecipeList();
    initFilters();
  } else if (pageId === 'upload') {
    initUploadForm();
  }
}

/* Recipe Cards */
function createRecipeCard(recipe) {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  card.innerHTML = `
    <img src="${recipe.img}" alt="${recipe.title}">
    <div class="recipe-info">
      <span class="country">${recipe.country}</span>
      <h3>${recipe.title}</h3>
    </div>
  `;
  card.onclick = () => openModal(recipe);
  return card;
}

function loadPreviewRecipes() {
  const previewGrid = document.getElementById('previewGrid');
  if (!previewGrid) return;
  
  previewGrid.innerHTML = '';
  getRecipes().slice(0, 6).forEach(recipe => {
    previewGrid.appendChild(createRecipeCard(recipe));
  });
}

function renderRecipeList() {
  const recipeGrid = document.getElementById('recipeGrid');
  if (!recipeGrid) return;
  
  recipeGrid.innerHTML = '';
  getRecipes().forEach(recipe => {
    recipeGrid.appendChild(createRecipeCard(recipe));
  });
}

/* Filters */
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      const recipeGrid = document.getElementById('recipeGrid');
      if (!recipeGrid) return;
      
      recipeGrid.innerHTML = '';
      const filteredRecipes = filter === 'all' 
        ? getRecipes() 
        : getRecipes().filter(recipe => recipe.country === filter);
      
      filteredRecipes.forEach(recipe => {
        recipeGrid.appendChild(createRecipeCard(recipe));
      });
    });
  });
}

/* Upload Form */
function initUploadForm() {
  const form = document.getElementById('recipeForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const recipe = {
      id: Date.now(),
      country: document.getElementById('recipeCountry').value,
      title: document.getElementById('recipeTitle').value,
      img: document.getElementById('recipeImage').value || 'images/Margherita Pizza.png',
      ingredients: document.getElementById('recipeIngredients').value.split('\n').filter(i => i.trim()),
      steps: document.getElementById('recipeSteps').value
    };
    
    form.reset();
    alert('Recipe uploaded successfully!');
    showPage('recipes');
  });
}

/* Modal */
function openModal(recipe) {
  const modal = document.getElementById('recipeModal');
  const modalBody = document.getElementById('modalBody');
  
  if (!modal || !modalBody) return;
  
  modalBody.innerHTML = `
    <h2>${escapeHtml(recipe.title)}</h2>
    <p><strong>Cuisine:</strong> ${escapeHtml(recipe.country)}</p>
    <img src="${recipe.img}" alt="${escapeHtml(recipe.title)}">
    <div class="recipe-details">
      <h3>Ingredients</h3>
      <ul>${(recipe.ingredients || []).map(ing => `<li>${escapeHtml(ing)}</li>`).join('')}</ul>
      <h3>Cooking Steps</h3>
      <p>${escapeHtml(recipe.steps || '')}</p>
    </div>
  `;
  
  modal.style.display = 'block';
  
  const closeBtn = modal.querySelector('.close');
  if (closeBtn) {
    closeBtn.onclick = () => modal.style.display = 'none';
  }
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
}

/* Initialize */
document.addEventListener('DOMContentLoaded', function() {
  showPage('home');
});
