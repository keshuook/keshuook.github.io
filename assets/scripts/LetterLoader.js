import { Vector } from "./Vector.js";

class LetterLoader {
    #letterRawData;
    #letterData = [];
    #radius = 1;
    #canvas;
    #dampFactor;
    #phase;
    
    async #setSourceAndReturnObject(source) {
        this.#letterRawData = (await (await fetch(source)).json());
        return this;
    }
    static async createObject(source, canvas, dFactor) {
        const obj = new LetterLoader();
        obj.#canvas = canvas;
        obj.#dampFactor = dFactor;
        obj.#phase = Math.random() * Math.PI * 2;
        return await obj.#setSourceAndReturnObject(source);
    }

    addLetter(letter, x, y, width, height) {
        // Convert the points to actual coordinates and store them in an array. Also draw the nodes
        const nodes = [];
        const velocities = [];
        const rawPointData = this.#letterRawData[letter];

        rawPointData.nodes.forEach(node => {
            const p = [node[0]*width+x, node[1]*height+y]; // Normalize
            velocities.push([0, 0]); // Fill velocity data with zero's
            nodes.push(p);
        });

        this.#letterData.push({mean: nodes, current: nodes.slice(), velocities: velocities, edges: rawPointData.edges}); // A copy of nodes is made because array's are reference type variables.
    }
    update() {
        this.#letterData.forEach(letter => {
            // Calculate the force vectors for each node

            // Factor in the mouse position
            const restoringForce = [];
            for(var i = 0;i < letter.current.length;i++) {
                let positionVector = new Vector([letter.current[i][0], letter.current[i][1]]);
                restoringForce.push(positionVector);
            }

            // All nodes connected to a node are accounted for in the restoring force
            letter.edges.forEach(edge => {
                const p1 = letter.current[edge[0]];
                const p2 = letter.current[edge[1]];
                restoringForce[edge[0]].add(new Vector([p2[0] - p1[0], p2[1] - p1[1]]));
                restoringForce[edge[1]].add(new Vector([p1[0] - p2[0], p1[1] - p2[1]]));
            });

            // For subtle motion
            const swayFactor = Math.sin(Date.now() + this.#phase) * 100;
            const swayForce = new Vector([swayFactor * -0.6, swayFactor]);

            for(var i = 0;i < letter.velocities.length;i++) {
                let velocity = letter.velocities[i];

                // Damp the velocity
                velocity = [velocity[0]*this.#dampFactor, velocity[1]*this.#dampFactor];

                const position = letter.current[i];
                const mean = letter.mean[i];

                // Also make it restore to it's mean position
                restoringForce[i].add((new Vector([mean[0] - position[0], mean[1] - position[1]])).smult(10));

                // A subtle swaying force (based on a time controlled SHM sine wave)
                restoringForce[i].add(swayForce);

                const vec = restoringForce[i].smult(0.001);
                letter.velocities[i] = [velocity[0] + vec.x, velocity[1] + vec.y];
                letter.current[i] = [position[0] + velocity[0], position[1] + velocity[1]];
            }
        })
    }
    render() {
        // Draw points on the canvas
        const ctx = this.#canvas.getContext('2d');
        ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        this.#letterData.forEach(letter => {
            letter.current.forEach(p => {
                // Draw the nodes (as circles)
                ctx.beginPath();
                ctx.arc(p[0], p[1], this.#radius, 0, Math.PI * 2);
                ctx.fill();
            });
            letter.edges.forEach(edge => {
                const p1 = letter.current[edge[0]];
                const p2 = letter.current[edge[1]];
                
                ctx.beginPath();
                ctx.moveTo(p1[0], p1[1]);
                ctx.lineTo(p2[0], p2[1]);
                ctx.stroke();
            });
        })
    }
}

export {LetterLoader}