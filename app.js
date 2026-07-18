//=========================================
// GLOBAL VARIABLES
//=========================================

const products = [];
const users = [];

let isLoggedIn = false;
let currentUser = null;

const graph = new Graph();
const tree = new BST();
const cache = new LRUCache(3);

//=========================================
// DEFAULT PRODUCTS
//=========================================

const defaultProducts = [

new Product(101,"Laptop","Electronics",4.8),

new Product(102,"Smart Phone","Electronics",4.7),

new Product(103,"Keyboard","Accessories",4.5),

new Product(104,"Headphones","Accessories",4.9),

new Product(105,"Monitor","Electronics",4.6),

new Product(106,"Mouse","Accessories",4.4),

new Product(107,"Tablet","Electronics",4.5),

new Product(108,"Printer","Electronics",4.3)

];

//=========================================
// SAVE FUNCTIONS
//=========================================

function saveProducts(){

localStorage.setItem(

"products",

JSON.stringify(products)

);

}

function saveUsers(){

localStorage.setItem(

"users",

JSON.stringify(users)

);

}

function saveGraph(){

    console.log("H",graph.userToProducts);

const graphData=[];
for(const [user,items] of graph.userToProducts){

graphData.push({

userID:user,

products:items

});

}

localStorage.setItem(

"graph",

JSON.stringify(graphData)

);


console.log(localStorage.getItem("graph"));
}

function saveLogin(){

localStorage.setItem(

"isLoggedIn",

JSON.stringify(isLoggedIn)

);

localStorage.setItem(

"currentUser",

JSON.stringify(currentUser)

);

}

//=========================================
// LOAD PRODUCTS
//=========================================

function loadProducts(){

const data=JSON.parse(

localStorage.getItem("products")

);

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

//=========================================
// LOAD USERS
//=========================================

function loadUsers(){

const data=JSON.parse(

localStorage.getItem("users")

);

if(data){

data.forEach(user=>users.push(user));

}

}

//=========================================
// LOAD GRAPH
//=========================================
function loadGraph(){

    console.log("HELLO LOADED")
      const dataS = JSON.parse(localStorage.getItem("graph"));

    console.log(dataS)
    const data = JSON.parse(localStorage.getItem("graph"));

    if(!data) return;

    data.forEach(item=>{

        item.products.forEach(productID=>{

            graph.addPurchase(item.userID, productID);

        });

    });

}
// ======================================
// LOAD LOGIN
//=========================================

function loadLogin(){

const login=JSON.parse(

localStorage.getItem("isLoggedIn")

);

const user=JSON.parse(

localStorage.getItem("currentUser")

);

if(login){

isLoggedIn=true;

currentUser=user;

}

}

//=========================================
// REGISTER
//=========================================

function registerUser(){

const name=document.getElementById("registerName").value;

const username=document.getElementById("registerUsername").value;

const password=document.getElementById("registerPassword").value;

if(name===""||username===""||password===""){

alert("Fill All Fields");

return;

}

const id=users.length+1;

const user=new User(

id,

name,

username,

password

);

users.push(user);

saveUsers();

alert("Registration Successful");

window.location="login.html";

}

//=========================================
// LOGIN
//=========================================

function loginUser(){

const username=document.getElementById("loginUsername").value;

const password=document.getElementById("loginPassword").value;

const user=users.find(

u=>u.username===username &&

u.password===password

);

if(!user){

alert("Invalid Username or Password");

return;

}

isLoggedIn=true;

currentUser=user.id;

saveLogin();

alert("Login Successful");

window.location.href="dashboard.html";

}

//=========================================
// LOGOUT
//=========================================

function logout(){

isLoggedIn=false;

currentUser=null;

saveLogin();

window.location="index.html";

}

//=========================================
// DASHBOARD
//=========================================

function loadDashboard(){

const welcome=document.getElementById(

"welcomeUser"

);

if(!welcome) return;

const user=users.find(

u=>u.id===currentUser

);

if(user){

welcome.innerHTML=

"Welcome, "+user.name+" 👋";

}

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

function displayProducts(){

const container=document.getElementById("productContainer");

if(!container) return;

container.innerHTML="";

products.forEach(product=>{

container.innerHTML+=`

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

function buyProduct(productID){
console.log("Buying Product:", productID);

if(!isLoggedIn){

alert("Please Login First");

return;

}

const purchased=graph.getProducts(currentUser);

if(purchased.includes(productID)){

alert("Already Purchased");

return;

}

graph.addPurchase(

currentUser,

productID

);

saveGraph();

alert("Purchase Successful");

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

    const category =
    document.getElementById("categoryInput")
    .value
    .trim();

    const rating =
    parseFloat(
        document.getElementById("ratingInput").value
    );

    const container =
    document.getElementById("productContainer");

    if(!container)
        return;

    container.innerHTML = "";

    //-----------------------------------

    if(category===""){

        alert("Enter Category");

        return;

    }

    //-----------------------------------

    const result =
    tree.searchProducts(

        category,

        isNaN(rating) ? 0 : rating

    );

    //-----------------------------------

    if(result.length===0){

        container.innerHTML=

        "<h2>No Product Found</h2>";

        return;

    }

    //-----------------------------------

    result.forEach(product=>{

        container.innerHTML+=`

        <div class="product-card">

            <h2>${product.name}</h2>

            <p><strong>ID :</strong> ${product.id}</p>

            <p><strong>Category :</strong> ${product.category}</p>

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

    if(!isLoggedIn){

        alert("Please Login First");
        return;

    }

    //--------------------------------------
    // CHECK CACHE
    //--------------------------------------

    const cached = cache.get(currentUser);

    if(cached){

        displayRecommendations(cached,true);
        return;

    }

    //--------------------------------------
    // BFS
    //--------------------------------------

    const scores = bfsRecommendation(currentUser);

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

    cache.put(currentUser,recommendations);

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

function showCurrentUser(){

    const heading=document.getElementById(

        "welcomeUser"

    );

    if(!heading)

        return;

    const user=users.find(

        u=>u.id===currentUser

    );

    if(user)

        heading.innerHTML=

        "Welcome "+user.name+" 👋";

}

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

function showPurchaseHistory(){

const container=document.getElementById("historyContainer");

if(!container) return;

container.innerHTML="";

const purchases=graph.getProducts(currentUser);

if(purchases.length===0){

container.innerHTML="<h3>No Purchases Yet</h3>";

return;

}

purchases.forEach(id=>{

const product=products.find(

p=>p.id===id

);

container.innerHTML+=`

<div class="history-card">

<h3>${product.name}</h3>

<p>${product.category}</p>

</div>

`;

});

}
//=========================================
// INITIAL PAGE LOAD
//=========================================

window.onload=function(){

    loadProducts();

    loadUsers();

    loadGraph();

    loadLogin();

    displayProducts();

    loadCache();
    
    displayCache();
    showCurrentUser();

    updateDashboard();

    initializeDashboard();

}

