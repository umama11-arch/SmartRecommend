//==========================================
// Cache Node
//==========================================

class CacheNode {

    constructor(userID, recommendations) {

        this.userID = userID;
        this.recommendations = recommendations;

        this.prev = null;
        this.next = null;

    }

}

//==========================================
// LRU Cache
//==========================================

class LRUCache {

    constructor(capacity) {

        this.capacity = capacity;

        this.cache = new Map();

        this.head = null;

        this.tail = null;

    }

    //--------------------------------------
    // Move Node To Front
    //--------------------------------------

    moveToFront(node) {

        if (node === this.head)
            return;

        if (node === this.tail) {

            this.tail = this.tail.prev;

            if (this.tail)
                this.tail.next = null;

        }

        else {

            if (node.prev)
                node.prev.next = node.next;

            if (node.next)
                node.next.prev = node.prev;

        }

        node.prev = null;
        
        node.next = this.head;

        if (this.head)
            this.head.prev = node;

        this.head = node;

        if (!this.tail)
            this.tail = node;
        
    }
    
    //--------------------------------------
    // GET
    //--------------------------------------

    get(userID) {

        if (!this.cache.has(userID))
            return null;

        const node = this.cache.get(userID);

        this.moveToFront(node);
        
        return node.recommendations;
        
    }
    
    //--------------------------------------
    // PUT
    //--------------------------------------
    
    put(userID, recommendations) {

        if (this.cache.has(userID)) {

            const node = this.cache.get(userID);
            
            node.recommendations = recommendations;

            this.moveToFront(node);

            return;
            console.log(cache)
            
        }

        const node = new CacheNode(userID, recommendations);
        
        node.next = this.head;
        
        if (this.head)
            this.head.prev = node;

        this.head = node;

        if (!this.tail)
            this.tail = node;

        this.cache.set(userID, node);

        //----------------------------------

        if (this.cache.size > this.capacity) {

    const removeNode=this.tail;

    this.cache.delete(removeNode.userID);

    this.tail=removeNode.prev;

    if(this.tail){

        this.tail.next=null;

    }
    else{

        this.head=null;

    }

}

    }

    //--------------------------------------
    // DISPLAY
    //--------------------------------------

    display() {

        let temp = this.head;

        console.log("------ LRU Cache ------");

        while (temp) {

            console.log(

                "User",

                temp.userID,

                "->",

                temp.recommendations

            );

            temp = temp.next;

        }

    }

}
