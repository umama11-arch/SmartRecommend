//==========================================
// GRAPH (BIPARTITE GRAPH)
//==========================================

class Graph{

    constructor(){

        // User -> Products
        this.userToProducts = new Map();

        // Product -> Users
        this.productToUsers = new Map();

    }

    //--------------------------------------
    // ADD PURCHASE
    //--------------------------------------

    addPurchase(userID,productID){

        // User -> Product
        if(!this.userToProducts.has(userID))
            this.userToProducts.set(userID,[]);

        this.userToProducts.get(userID).push(productID);

        // Product -> User
        if(!this.productToUsers.has(productID))
            this.productToUsers.set(productID,[]);

        this.productToUsers.get(productID).push(userID);

    }

    //--------------------------------------
    // GET PRODUCTS OF USER
    //--------------------------------------

    getProducts(userID){

        if(!this.userToProducts.has(userID))
            return [];

        return this.userToProducts.get(userID);

    }

    //--------------------------------------
    // DISPLAY GRAPH
    //--------------------------------------

    displayGraph(){

        console.log("========== PURCHASE GRAPH ==========");

        for(const [user,products] of this.userToProducts){

            console.log(
                "User",
                user,
                "->",
                products.join(", ")
            );

        }

    }

}



//==========================================
// BFS COLLABORATIVE FILTERING
//==========================================

function bfsRecommendation(userID){

    const scores = new Map();

    const myProducts = graph.getProducts(userID);

    myProducts.forEach(productID=>{

        const users = graph.productToUsers.get(productID) || [];

        users.forEach(otherUser=>{

            if(otherUser === userID) return;

            const products = graph.getProducts(otherUser);

            products.forEach(product=>{

                if(!myProducts.includes(product)){

                    scores.set(
                        product,
                        (scores.get(product) || 0) + 1
                    );

                }

            });

        });

    });

    return scores;
}