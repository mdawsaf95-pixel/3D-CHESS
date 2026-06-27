// Three.js 3D Chess Board Setup
class Chess3DBoard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.pieces = {};
        this.squares = {};
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x1a1a1a);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(8, 10, 8);
        this.camera.lookAt(4, 0, 4);

        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 15, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Create board
        this.createBoard();
        this.createPieces();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    createBoard() {
        const boardSize = 8;
        const squareSize = 1;
        const lightColor = 0xf0d9b5;
        const darkColor = 0xb58863;

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const color = (row + col) % 2 === 0 ? lightColor : darkColor;
                const geometry = new THREE.PlaneGeometry(squareSize, squareSize);
                const material = new THREE.MeshLambertMaterial({ color: color });
                const square = new THREE.Mesh(geometry, material);

                square.position.set(col, 0, row);
                square.receiveShadow = true;
                square.castShadow = true;

                // Add click handler
                square.userData = { row, col };

                this.scene.add(square);
                this.squares[`${row}-${col}`] = square;
            }
        }

        // Add border
        const borderGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(8, 0.1, 8));
        const borderMaterial = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });
        const border = new THREE.LineSegments(borderGeometry, borderMaterial);
        border.position.y = -0.1;
        this.scene.add(border);
    }

    createPieces() {
        const pieceTypes = {
            'pawn': this.createPawn.bind(this),
            'rook': this.createRook.bind(this),
            'knight': this.createKnight.bind(this),
            'bishop': this.createBishop.bind(this),
            'queen': this.createQueen.bind(this),
            'king': this.createKing.bind(this)
        };

        // Standard chess starting position
        const startPosition = {
            0: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
            1: ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            6: ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            7: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
        };

        for (const row in startPosition) {
            const color = row < 4 ? 'black' : 'white';
            startPosition[row].forEach((type, col) => {
                const piece = pieceTypes[type](color);
                piece.position.set(col, 0.5, row);
                this.scene.add(piece);
                this.pieces[`${row}-${col}`] = piece;
            });
        }
    }

    createPawn(color) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: color === 'white' ? 0xffffff : 0x000000 });

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 32), material);
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), material);
        body.position.y = 0.3;

        group.add(base);
        group.add(body);
        return group;
    }

    createRook(color) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: color === 'white' ? 0xffffff : 0x000000 });

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 8), material);
        const tower = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.35), material);
        tower.position.y = 0.35;

        group.add(base);
        group.add(tower);
        return group;
    }

    createKnight(color) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: color === 'white' ? 0xffffff : 0x000000 });

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 32), material);
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3), material);
        head.position.y = 0.35;

        group.add(base);
        group.add(head);
        return group;
    }

    createBishop(color) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: color === 'white' ? 0xffffff : 0x000000 });

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 32), material);
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 32), material);
        body.position.y = 0.4;

        group.add(base);
        group.add(body);
        return group;
    }

    createQueen(color) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: color === 'white' ? 0xffffff : 0x000000 });

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 32), material);
        const crown = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), material);
        crown.position.y = 0.5;
        crown.scale.y = 1.3;

        group.add(base);
        group.add(crown);
        return group;
    }

    createKing(color) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: color === 'white' ? 0xffffff : 0x000000 });

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 32), material);
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), material);
        body.position.y = 0.4;
        const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3), material);
        cross.position.y = 0.7;

        group.add(base);
        group.add(body);
        group.add(cross);
        return group;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const key = `${fromRow}-${fromCol}`;
        if (this.pieces[key]) {
            const piece = this.pieces[key];
            piece.position.set(toCol, 0.5, toRow);
            
            delete this.pieces[key];
            this.pieces[`${toRow}-${toCol}`] = piece;
        }
    }

    removePiece(row, col) {
        const key = `${row}-${col}`;
        if (this.pieces[key]) {
            this.scene.remove(this.pieces[key]);
            delete this.pieces[key];
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
