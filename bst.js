class BSTNode {

    constructor(product) {

        this.data = product;
        this.left = null;
        this.right = null;

    }

}

class BST {

    constructor() {

        this.root = null;

    }

    insert(node, product) {

        if (node === null) {

            return new BSTNode(product);

        }

        if (product.id < node.data.id) {

            node.left = this.insert(node.left, product);

        }

        else {

            node.right = this.insert(node.right, product);

        }

        return node;

    }

    insertProduct(product) {

        this.root = this.insert(this.root, product);

    }

    inorder(node) {

        if (node === null) {

            return;

        }

        this.inorder(node.left);

        console.log(node.data);

        this.inorder(node.right);

    }

    displayProducts() {

        this.inorder(this.root);

    }

    search(node, id) {

        if (node === null)

            return null;

        if (node.data.id === id)

            return node;

        if (id < node.data.id)

            return this.search(node.left, id);

        return this.search(node.right, id);

    }

    searchProduct(id) {

        return this.search(this.root, id);

    }

}