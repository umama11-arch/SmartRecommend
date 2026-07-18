class HeapNode {
    constructor(id, score) {
        this.id = id;
        this.score = score;
    }
}

class MinHeap {
    constructor() {
        this.heap = [];
    }

    heapifyUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);

            if (this.heap[parent].score <= this.heap[index].score) {
                break;
            }

            [this.heap[parent], this.heap[index]] =
            [this.heap[index], this.heap[parent]];

            index = parent;
        }
    }

    heapifyDown(index) {
        const n = this.heap.length;

        while (true) {
            const left = 2 * index + 1;
            const right = 2 * index + 2;
            let smallest = index;

            if (left < n && this.heap[left].score < this.heap[smallest].score) {
                smallest = left;
            }

            if (right < n && this.heap[right].score < this.heap[smallest].score) {
                smallest = right;
            }

            if (smallest === index) {
                break;
            }

            [this.heap[index], this.heap[smallest]] =
            [this.heap[smallest], this.heap[index]];

            index = smallest;
        }
    }

    insert(id, score) {
        this.heap.push(new HeapNode(id, score));
        this.heapifyUp(this.heap.length - 1);
    }

    removeMin() {
        if (this.heap.length === 0) {
            return null;
        }

        const root = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();

        if (this.heap.length > 0) {
            this.heapifyDown(0);
        }

        return root;
    }

    size() {
        return this.heap.length;
    }
}