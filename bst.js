//==========================================
// BST NODE
//==========================================

class BSTNode{

    constructor(product){

        this.data = product;

        this.left = null;

        this.right = null;

    }

}

//==========================================
// BST
//==========================================

class BST{

    constructor(){

        this.root = null;

    }

    //--------------------------------------
    // COMPARE PRODUCTS
    //--------------------------------------

    compareProducts(a,b){

        //----------------------------------
        // Category First
        //----------------------------------

        const catA = a.category.toLowerCase();

        const catB = b.category.toLowerCase();

        if(catA < catB)
            return -1;

        if(catA > catB)
            return 1;

        //----------------------------------
        // Same Category
        // Higher Rating First
        //----------------------------------

        if(a.rating > b.rating)
            return -1;

        if(a.rating < b.rating)
            return 1;

        //----------------------------------
        // Same Rating
        //----------------------------------

        return a.id - b.id;

    }

    //--------------------------------------
    // INSERT
    //--------------------------------------

    insert(node,product){

        if(node==null)

            return new BSTNode(product);

        const compare = this.compareProducts(

            product,

            node.data

        );

        if(compare<0)

            node.left=

            this.insert(

                node.left,

                product

            );

        else

            node.right=

            this.insert(

                node.right,

                product

            );

        return node;

    }

    //--------------------------------------
    // INSERT PRODUCT
    //--------------------------------------

    insertProduct(product){

        this.root=

        this.insert(

            this.root,

            product

        );

    }

    //--------------------------------------
    // DISPLAY
    //--------------------------------------

    inorder(node){

        if(node==null)

            return;

        this.inorder(node.left);

        console.log(node.data);

        this.inorder(node.right);

        this.inorder(node.right);

    }

    displayProducts(){

        this.inorder(this.root);

    }

    //--------------------------------------
    // SEARCH BY CATEGORY + RATING
    //--------------------------------------

    search(node,category,minRating,result){

        if(node==null)

            return;

        this.search(

            node.left,

            category,

            minRating,

            result

        );

        const product=node.data;

        if(

            product.category.toLowerCase()===

            category.toLowerCase()

            &&

            product.rating>=minRating

        ){

            result.push(product);

        }

        this.search(

            node.right,

            category,

            minRating,

            result

        );

    }

    //--------------------------------------
    // PUBLIC SEARCH
    //--------------------------------------

    searchProducts(

        category,

        minRating

    ){

        const result=[];

        this.search(

            this.root,

            category,

            minRating,

            result

        );

        return result;

    }

    //--------------------------------------
    // RANGE QUERY
    //--------------------------------------

    rangeQuery(

        node,

        minRating,

        maxRating,

        result

    ){

        if(node==null)

            return;

        this.rangeQuery(

            node.left,

            minRating,

            maxRating,

            result

        );

        if(

            node.data.rating>=minRating

            &&

            node.data.rating<=maxRating

        ){

            result.push(node.data);

        }

        this.rangeQuery(

            node.right,

            minRating,

            maxRating,

            result

        );

    }

    //--------------------------------------
    // GET PRODUCTS IN RATING RANGE
    //--------------------------------------

    getProductsInRange(

        minRating,

        maxRating

    ){

        const result=[];

        this.rangeQuery(

            this.root,

            minRating,

            maxRating,

            result

        );

        return result;

    }

}