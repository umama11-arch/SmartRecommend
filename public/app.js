//=========================================
// GLOBAL VARIABLES
//=========================================
const API_URL="https://vercel.com/umama-ishaq-s-projects/smart-recommend/9oDFgahU4gxAkDJVgjnoHWMoBCUm"
async function testDatabase() {
  try {
    const response = await fetch(`${API_URL}/api/test-db`);
    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error("API error:", error);
  }
}

testDatabase();
let products = [];

async function fetchproducts() {
    const res = await fetch(`${API_URL}/api/fetchproducts`);
    products= await res.json();
    // products=response.result.rows
}

fetchproducts();

let isLoggedIn = false;
let currentUser = JSON.parse(localStorage.getItem("recentuser"))

console.log(currentUser.id)
const graph = new Graph();
const tree = new BST();
const cache = new LRUCache(3);
const admin = {
    username: "admin",
    password: "admin123"
};
let isAdmin = false;

//=========================================
// LOAD PRODUCTS
//=========================================

async function loadProducts(){
    try {
        
        const res=await fetch(`${API_URL}/api/fetchproducts`);
        const data=await res.json();
        // const data=await datas.result.rows
        if(data){
            data.forEach(product=>{
                products.push(product);
                tree.insertProduct(product);
            });
        }
        else{
            defaultProducts.forEach(product=>{
                products.push(product);
                tree.insertProduct(product);
            });
            saveProducts();
        } 
    }
        catch (error) {
            
        }
    }



//=========================================
// LOAD GRAPH
//=========================================
async function loadGraph(){
    const dataset=await fetch(`${API_URL}/api/fetchgraph`)
    const datas=await dataset.text();
    const data=await JSON.parse(datas)
console.log(data)

console.log(Array.isArray(data));
    if(!data) return;

    data.forEach(item=>{
            graph.addPurchase(item.user_id,item.product_id);

    });

}



//=========================================
// LOGOUT
//=========================================

function logout(){

currentUser=null;
isAdmin=false;
saveLogin();
window.location="index.html";

}

// console.log("hi",isAdmin);
//=========================================
// DASHBOARD
//=========================================

function loadDashboard(){

// const welcome=document.getElementById(

// "welcomeUser"

// );

// if(!welcome) return;

// const user=users.find(

// u=>u.id===currentUser

// );

// if(user){

// welcome.innerHTML=

// "Welcome, Umama 👋";

// }

document.getElementById(

"totalProducts"

).innerHTML=products.length;

document.getElementById(

"totalUsers"

).innerHTML=users.length;

document.getElementById(

"purchaseCount"

).innerHTML=

graph.userToProducts.size;

document.getElementById(

"cacheSize"

).innerHTML=

cache.cache.size;

}

//=========================================
// DISPLAY PRODUCTS
//=========================================

async function displayProducts() {
    await fetchproducts()
    const productList=products
    console.log(productList)
    const container = document.getElementById("productContainer");

    if (!container) return;

    container.innerHTML = "";

    if (productList.length === 0) {

        container.innerHTML = `

        <div class="no-products">

            <i class="fa-solid fa-box-open"></i>

            <h2>No Products Found</h2>

            <p>No products match your search.</p>

        </div>

        `;

        return;
    }

    productList.forEach(product => {

        //----------------------------------
        // Product Icon
        //----------------------------------

        let icon = "fa-box";

        if (product.category.toLowerCase() === "electronics") {

            if (product.name.toLowerCase().includes("laptop"))
                icon = "fa-laptop";

            else if (product.name.toLowerCase().includes("phone"))
                icon = "fa-mobile-screen";

            else if (product.name.toLowerCase().includes("monitor"))
                icon = "fa-desktop";

            else
                icon = "fa-tv";
        }

        else {

            if (product.name.toLowerCase().includes("keyboard"))
                icon = "fa-keyboard";

            else if (product.name.toLowerCase().includes("mouse"))
                icon = "fa-computer-mouse";

            else if (product.name.toLowerCase().includes("headphone"))
                icon = "fa-headphones";

            else
                icon = "fa-plug";
        }

        //----------------------------------
        // Description
        //----------------------------------

        let description = "Premium quality product.";

        if (product.name.toLowerCase().includes("laptop"))
            description = "High performance laptop for work & study.";

        else if (product.name.toLowerCase().includes("phone"))
            description = "Latest smartphone with modern features.";

        else if (product.name.toLowerCase().includes("keyboard"))
            description = "Mechanical keyboard for smooth typing.";

        else if (product.name.toLowerCase().includes("mouse"))
            description = "Wireless ergonomic mouse.";

        else if (product.name.toLowerCase().includes("headphone"))
            description = "Noise cancelling headphones.";

        else if (product.name.toLowerCase().includes("monitor"))
            description = "Crystal clear display monitor.";

        //----------------------------------
        // Stars
        //----------------------------------

        let stars = "";

        for (let i = 0; i < Math.floor(product.rating); i++) {

            stars += "⭐";

        }

        //----------------------------------
        // Button
        //----------------------------------

        let buttonHTML = "";

        if (isAdmin) {

            buttonHTML = `

            <button
                class="deleteBtn"
                onclick="deleteProduct(${product.id})">

                <i class="fa-solid fa-trash"></i>

                Delete

            </button>

            `;

        }

        else {

            buttonHTML = `

            <button
                class="buyBtn"
                onclick="buyProduct(${product.id})">

                <i class="fa-solid fa-cart-shopping"></i>

                Buy Now

            </button>

            `;

        }

        //----------------------------------
        // Card
        //----------------------------------

        container.innerHTML += `

        <div class="product-card">

            <div class="product-icon">

                <i class="fa-solid ${icon}"></i>

            </div>

            <h3>${product.name}</h3>

            <div class="product-rating">

                ${stars} (${product.rating})

            </div>

            <div class="product-category">

                ${product.category}

            </div>

            <p class="product-desc">

                ${description}

            </p>

            ${buttonHTML}

        </div>

        `;

    });

}

function deleteProduct(id){

    const index = products.findIndex(p=>p.id===id);

    if(index===-1)
        return;

    products.splice(index,1);

    saveProducts();

    tree.root=null;

    products.forEach(product=>{

        tree.insertProduct(product);

    });

    displayProducts();

    alert("Product Deleted Successfully");

}

//=========================================
// ADD PRODUCT
//=========================================

function addProduct(id,name,category,rating){

const product=new Product(

id,

name,

category,

rating

);

products.push(product);

tree.insertProduct(product);

saveProducts();

displayProducts();

}

//=========================================
// BUY PRODUCT
//=========================================

async function buyProduct(productID){
console.log("Buying Product:", productID);
const user=await JSON.parse(localStorage.getItem("recentuser"));
if(!user.id){
alert("Please Login First");

return;

}
const userid=user.id
console.log(userid)
const purchased=await fetch(`${API_URL}/api/buyproducts`,{
    method:"Post",
    headers:{
        "Content-Type": "application/json"
    }
    ,
body: JSON.stringify({
    userid: userid,
    productID: productID
})
})
// const text =await purchased.text()
// console.log(text)
alert(await purchased.text())
// const purchased=graph.getProducts(user);

// if(purchased.includes(productID)){

// alert("Already Purchased");

// return;
// 
// }

// graph.addPurchase(

// user,

// productID

// );

// saveGraph();

// alert("Purchase Successful");

}

console.log([...graph.userToProducts.entries()]);
console.log([...graph.productToUsers.entries()]);
//=========================================
// SEARCH PRODUCT
//=========================================



//=========================================
// SEARCH PRODUCT (CATEGORY + RATING)
//=========================================
function searchProduct(){

    const input = document.getElementById("searchInput");

    if(!input) return;

    const id = parseInt(input.value);

    if(isNaN(id)){

        displayProducts();
        return;

    }

    const node = tree.searchProduct(id);

    if(node===null){

        displayProducts([]);
        return;

    }

    displayProducts([node.data]);

}
function addNewProduct(){

    const id = parseInt(document.getElementById("productId").value);

    const name = document.getElementById("productName").value;

    const category = document.getElementById("productCategory").value;

    const rating = parseFloat(document.getElementById("productRating").value);

    if(!id || !name || !category || isNaN(rating)){
        alert("Please fill all fields");
        return;
    }

    const product = new Product(id,name,category,rating);

    products.push(product);

    tree.insertProduct(product);

    saveProducts();

    displayProducts();

    alert("Product Added Successfully!");
    closeModal()
}

//====================================================
// GET PRODUCT NAME
//====================================================

function getProductName(id){

    const product=products.find(p=>p.id===id);

    if(product)

        return product.name;

    return "Unknown";

}

//====================================================
// GENERATE RECOMMENDATIONS
//====================================================

//====================================================
// GENERATE RECOMMENDATIONS USING BFS
//====================================================

function recommendProducts(){
    if(!currentUser.id){

        alert("Please Login First");
        return;

    }

    //--------------------------------------
    // CHECK CACHE
    //--------------------------------------

    const cached = cache.get(currentUser.id);

    if(cached){

        displayRecommendations(cached,true);
        return;

    }

    //--------------------------------------
    // BFS
    //--------------------------------------

    const scores = bfsRecommendation(currentUser.id);

    if(scores.size===0){

        alert("No Recommendation Found");
        return;

    }

    //--------------------------------------
    // TOP K USING MIN HEAP
    //--------------------------------------

    const heap = new MinHeap();

    scores.forEach((score,productID)=>{
        heap.insert(productID,score);

    });

    //--------------------------------------
    // SORT BY SCORE
    //--------------------------------------

    const ranked=[];

    while(heap.size()>0){

        ranked.push(heap.removeMin());

    }

    ranked.reverse();

    //--------------------------------------
    // TAKE TOP K
    //--------------------------------------

    const TOP_K = 5;

    const recommendations=[];

    for(let i=0;i<Math.min(TOP_K,ranked.length);i++){

        recommendations.push(ranked[i].id);

    }

    //--------------------------------------
    // SAVE IN CACHE
    //--------------------------------------

    cache.put(currentUser.id,recommendations);

    saveCache()

    //--------------------------------------
    // DISPLAY
    //--------------------------------------

    displayRecommendations(recommendations,false);

}

//=============================================
// DISPLAY RECOMMENDATIONS
//=============================================

function displayRecommendations(list, isCache) {

    const container = document.getElementById("recommendationContainer");

    if (!container) return;

    container.innerHTML = "";

    if (isCache) {

        container.innerHTML += `
        <h2>Recommendations From Cache ⚡</h2>
        `;

    } else {

        container.innerHTML += `
        <h2>Fresh Recommendations</h2>
        `;

    }

   list.forEach(id=>{

    const node = tree.searchProduct(id);

    if(node){

        const product = node.data;

        container.innerHTML += `

        <div class="recommend-card">

            <h3>${product.name}</h3>

            <p>ID : ${product.id}</p>

            <p>Category : ${product.category}</p>

            <p>⭐ ${product.rating}</p>

        </div>

        `;
    }

});

}


function saveCache(){

const data=[];

let temp=cache.head;

while(temp){

data.push({

userID:temp.userID,

recommendations:
temp.recommendations

});

temp=temp.next;

}

localStorage.setItem(

"cache",

JSON.stringify(data)

);

}

function loadCache(){

const data=JSON.parse(

localStorage.getItem("cache")

);

if(!data) return;

data.reverse().forEach(item=>{

cache.put(

item.userID,

item.recommendations

);

});

}
//=========================================
// DISPLAY CACHE
//=========================================

function displayCache(){

    const container=document.getElementById("cacheContainer");

    if(!container) return;

    container.innerHTML="";

    let temp=cache.head;

    if(temp==null){

        container.innerHTML="<h2>Cache Empty</h2>";

        return;

    }

    while(temp){

        let html=`

        <div class="cache-card">

        <h2>

        User ${temp.userID}

        </h2>

        <p>

        Recommended Products

        </p>

        <ul>

        `;

        temp.recommendations.forEach(id=>{

            const product=products.find(

                p=>p.id===id

            );

            if(product){

                html+=`

                <li>

                ${product.name}

                </li>

                `;

            }

        });

        html+=`

        </ul>

        </div>

        `;

        container.innerHTML+=html;

        temp=temp.next;

    }

}

//=========================================
// UPDATE DASHBOARD
//=========================================

function updateDashboard(){

    const totalProducts=document.getElementById(

        "totalProducts"

    );

    const totalUsers=document.getElementById(

        "totalUsers"

    );

    const purchaseCount=document.getElementById(

        "purchaseCount"

    );

    const cacheSize=document.getElementById(

        "cacheSize"

    );

    if(totalProducts)

        totalProducts.innerHTML=products.length;

    if(totalUsers)

        totalUsers.innerHTML=users.length;

    if(purchaseCount)
{

    let count=0;
    
    for(const items of graph.userToProducts.values()){
        
        count+=items.length;
        
    }
    
    purchaseCount.innerHTML=count;
}

    if(cacheSize)

        cacheSize.innerHTML=

        cache.cache.size;

}

//=========================================
// SHOW CURRENT USER
//=========================================

// function showCurrentUser(){

//     const heading=document.getElementById(

//         "welcomeUser"

//     );

//     if(!heading)

//         return;

//     if(user)

//         heading.innerHTML=
//     '   Welcome Umama  👋'
//         // "Welcome "+user.name+" 👋";

// }

//=========================================
// DASHBOARD BUTTONS
//=========================================

function initializeDashboard(){

    const productsBtn=

    document.getElementById(

        "viewProductsBtn"

    );

    if(productsBtn){

        productsBtn.onclick=function(){

            window.location=

            "products.html";

        };

    }

    //-------------------------------------

    const recommendationBtn=

    document.getElementById(

        "recommendBtn"

    );

    if(recommendationBtn){

        recommendationBtn.onclick=function(){

            window.location=

            "recommendation.html";

        };

    }

    //-------------------------------------

    const cacheBtn=

    document.getElementById(

        "cacheBtn"

    );

    if(cacheBtn){

        cacheBtn.onclick=function(){

            window.location=

            "cache.html";

        };

    }

    //-------------------------------------

    const searchBtn=

    document.getElementById(

        "searchBtn"

    );

    if(searchBtn){

        searchBtn.onclick=function(){

            window.location=

            "search.html";

        };

    }

    //-------------------------------------

    const logoutBtn=

    document.getElementById(

        "logoutBtn"

    );

    if(logoutBtn){

        logoutBtn.onclick=function(){

            logout();

        };

    }

}


//=========================================
// FORM EVENTS
//=========================================

const registerForm=document.getElementById("registerForm");

if(registerForm){

registerForm.addEventListener("submit",function(e){

e.preventDefault();

registerUser();

});

}

const loginForm=document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",function(e){

e.preventDefault();

loginUser();

});

}

//=========================================
// SEARCH BUTTON
//=========================================

const searchButton=document.getElementById("searchBtn");

if(searchButton){

searchButton.addEventListener("click",searchProduct);

}

//=========================================
// RECOMMEND BUTTON
//=========================================

const recommendButton=document.getElementById("generateBtn");

if(recommendButton){

recommendButton.addEventListener("click",recommendProducts);

}

//=========================================
// SAVE BEFORE EXIT
//=========================================

window.addEventListener("beforeunload",function(){

saveProducts();

saveUsers();

saveGraph();

saveLogin();
saveCache()

});

//=========================================
// REFRESH UI
//=========================================

function refreshUI(){

displayProducts();

displayCache();

updateDashboard();

showCurrentUser();

}

async function showPurchaseHistory(){

const container=document.getElementById("historyContainer");

if(!container) return;

container.innerHTML="";
const userid=currentUser.id
const purchasedproducts=await fetch(`$${API_URL}/api/purchases?userid=${userid}`)
const purchase=await purchasedproducts.text()
const purchases=JSON.parse(purchase)
if(purchases.length===0){

container.innerHTML="<h3>No Purchases Yet</h3>";

return;

}

purchases.forEach(p=>{


container.innerHTML+=`

<div class="history-card">

<h3>${p.name}</h3>

<p>${p.category}</p>
<p>${p.price}</p>
<p>${p.rating}</p>

</div>

`;

});

}

function filterProducts(){

    const category =
        document.getElementById("categoryFilter").value;

    const rating =
        parseFloat(
            document.getElementById("ratingFilter").value
        );

    const container =
        document.getElementById("productContainer");

    container.innerHTML = "";

    const filtered = products.filter(product => {

        const categoryMatch =

            category === "" ||

            product.category === category;

        const ratingMatch =

            product.rating >= rating;

        return categoryMatch && ratingMatch;

    });

    if(filtered.length === 0){

        container.innerHTML =

        "<h2>No Product Found</h2>";

        return;

    }

    filtered.forEach(product => {

        container.innerHTML += `

        <div class="product-card">

            <h2>${product.name}</h2>

            <p><strong>ID:</strong> ${product.id}</p>

            <p><strong>Category:</strong> ${product.category}</p>

            <p>⭐ ${product.rating}</p>

            <button
            class="buyBtn"
            onclick="buyProduct(${product.id})">

                Buy Product

            </button>

        </div>

        `;

    });

}



function updateNavbar(){

    const nav = document.querySelector("nav");

    if(!nav) return;

    if(isAdmin){

        nav.innerHTML = `
            <a href="dashboard.html">Dashboard</a>
            <a href="products.html">Products</a>
            <a href="cache.html">LRU Cache</a>
            <a href="index.html">Logout</a>
        `;
    }
    else{

        nav.innerHTML = `
            <a href="user-dashboard.html">Dashboard</a>
            <a href="products.html">Products</a>
            <a href="recommendation.html">Recommendation</a>
            <a href="index.html">Logout</a>
        `;
    }
console.log("hello",isAdmin)
}

function updateProductPage(){

    const addBtn = document.getElementById("addProductBtn");

    if(!addBtn) return;

    if(isAdmin){

        addBtn.style.display="block";

    }
    else{

        addBtn.style.display="none";

    }

}

//=========================================
// USER DASHBOARD
//=========================================

function updateUserDashboard(){

    //----------------------------------
    // Welcome User
    //----------------------------------

    const welcome=document.getElementById("welcomeUser");

    const username=document.getElementById("currentUserName");

    if(!welcome || !username)
        return;

    const user=JSON.parse(localStorage.getItem("recentuser"))
    if(user){

        welcome.innerHTML=
        "Welcome, "+user.name+" 👋";

        username.innerHTML=
        user.name;

    }

    //----------------------------------
    // Purchased Products
    //----------------------------------

    const purchases=
    graph.getProducts(currentUser.id);

    document.getElementById(
        "purchaseCount"
    ).innerHTML=
    purchases.length;

    //----------------------------------
    // Recommendation Count
    //----------------------------------

    const recommendations=
    cache.get(currentUser);

    document.getElementById(
        "recommendationCount"
    ).innerHTML=
    recommendations ? recommendations.length : 0;

}

//=========================================
// USER DASHBOARD BUTTONS
//=========================================

function initializeUserDashboard(){

    const browseBtn=
    document.getElementById(
        "browseProductsBtn"
    );

    if(browseBtn){

        browseBtn.onclick=function(){

            window.location=
            "products.html";

        };

    }

    //----------------------------------

    const recommendationBtn=
    document.getElementById(
        "recommendationBtn"
    );

    if(recommendationBtn){

        recommendationBtn.onclick=function(){

            window.location=
            "recommendation.html";

        };

    }
//----------------------------------
// Purchase History
//----------------------------------

const historyBtn =
document.getElementById("historyBtn");

if(historyBtn){

    historyBtn.onclick=function(){

        window.location=
        "history.html";

    };

}
}
//=========================================
// INITIAL PAGE LOAD
//=========================================

window.onload=function(){

    loadProducts();


    loadGraph();

    // loadLogin();

    displayProducts();

    loadCache();
    
    displayCache();

    updateDashboard();
    updateNavbar();
    updateProductPage();
    initializeDashboard();
     updateUserDashboard();

    initializeUserDashboard();
    showPurchaseHistory()
}

