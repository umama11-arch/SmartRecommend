class Product {

    constructor(id, name, category, rating) {

        this.id = id;
        this.name = name;
        this.category = category;
        this.rating = rating;

    }

}

function openModal(){

document.getElementById("productModal").style.display="flex";

}

function closeModal(){

document.getElementById("productModal").style.display="none";

}