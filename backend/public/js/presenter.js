const socket = io();

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const connectMessageSpan = document.querySelector('#connect-message');

let uuid = '';
let code = '';
let images = [];

let globalState = null;

let controlMode = 'DRAWING';
let drawableMode = 'FREEDRAW';
let penDown = false;
let currentDrawable = null;

let drawableInfos = {
    FREEDRAW: {
        render: (context, data) => {
            context.strokeStyle = '#000';
            context.lineWidth = 3;
            context.beginPath();
            for (let j = 0; j < data.length; j++) {
                if (j == 0) context.moveTo(data[j].x * canvas.width, data[j].y * canvas.height);
                context.lineTo(data[j].x * canvas.width, data[j].y * canvas.height);
            }
            context.stroke();
        },
        mousedown: (mouseX, mouseY) => {
            currentDrawing = { type: 'FREEDRAW', uuid: uuid, data: [] };
        },
        mousemove: (mouseX, mouseY) => {
            currentDrawing.data.push({ x: mouseX / canvas.width, y: mouseY / canvas.height });
        }
    },
    HIGHLIGHT: {
        render: (context, data) => {
            context.strokeStyle = 'rgba(255, 255, 0, 0.5)';
            context.lineWidth = 20;
            context.beginPath();
            for (let j = 0; j < data.length; j++) {
                if (j == 0) context.moveTo(data[j].x * canvas.width, data[j].y * canvas.height);
                context.lineTo(data[j].x * canvas.width, data[j].y * canvas.height);
            }
            context.stroke();
        },
        mousedown: (mouseX, mouseY) => {
            currentDrawing = { type: 'HIGHLIGHT', uuid: uuid, data: [] };
        },
        mousemove: (mouseX, mouseY) => {
            currentDrawing.data.push({ x: mouseX / canvas.width, y: mouseY / canvas.height });
        }
    },
    RECTANGLE: {
        render: (context, data) => {
            context.strokeStyle = '#000';
            context.lineWidth = 5;
            let startX = Math.min(data.start.x, data.end.x) * canvas.width;
            let startY = Math.min(data.start.y, data.end.y) * canvas.height;
            let endX = Math.max(data.start.x, data.end.x) * canvas.width;
            let endY = Math.max(data.start.y, data.end.y) * canvas.height;
            context.strokeRect(startX, startY, endX - startX, endY - startY);
        },
        mousedown: (mouseX, mouseY) => {
            currentDrawing = {
                type: 'RECTANGLE', uuid: uuid, data: {
                    start: { x: mouseX / canvas.width, y: mouseY / canvas.height },
                    end: { x: mouseX / canvas.width, y: mouseY / canvas.height }
                }
            };
        },
        mousemove: (mouseX, mouseY) => {
            currentDrawing.data.end = { x: mouseX / canvas.width, y: mouseY / canvas.height };
        }
    },
    ERASER: {
        render: (context, data) => {},
        mousedown: (mouseX, mouseY) => {
            currentDrawing = { type: 'ERASER', uuid: uuid, data: { x: mouseX / canvas.width, y: mouseY / canvas.height } };
        },
        mousemove: (mouseX, mouseY) => {
            currentDrawing.data = { x: mouseX / canvas.width, y: mouseY / canvas.height };
        }
    }
}

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    code = urlParams.get('code');

    checkValidity(code).then(valid => {
        if (valid) {
            document.title = `prsntly.live - ${code}`;
            uuid = localStorage.getItem('uuid');
            
            if (uuid != null) {
                socket.emit('RECONNECT_PRESENTATION', code, uuid, response => {
                    if (response.status == 200) {
                        if (response.data) {
                            uuid = newUUID;
                            localStorage.setItem('uuid', uuid);
                        }
                        
                        connectMessageSpan.innerHTML = 'reconnected!';
                    } else {
                        localStorage.clear();
                        window.location.href = window.location.origin;
                    }
                });
            } else {
                socket.emit('JOIN_PRESENTATION', code, response => {
                    if (response.status == 200) {
                        uuid = response.data;
                        localStorage.setItem('uuid', uuid);

                        connectMessageSpan.innerHTML = 'joined!';
                    } else {
                        localStorage.clear();
                        window.location.href = window.location.origin;
                    }
                });
            }

            socket.on('GLOBAL_UPDATE', state => {
                globalState = state;
                
                if (images.length != 0) {
                    renderCurrentSlide();
                }
            });

            document.querySelector('#previous-slide').addEventListener('click', () => {
                if (globalState.currentSlide > 0) {
                    globalState.currentSlide -= 1;
                    socket.emit('SET_SLIDE', globalState.currentSlide, code);
                }
            });

            document.querySelector('#next-slide').addEventListener('click', () => {
                if (globalState.currentSlide < globalState.count - 1) {
                    globalState.currentSlide += 1;
                    socket.emit('SET_SLIDE', globalState.currentSlide, code);
                }
            });

            document.querySelector('#activate-drawing').addEventListener('click', () => {
                controlMode = 'DRAWING';
                document.querySelector('#drawing-controls').style.display = 'block';
            });

            document.querySelector('#activate-pointer').addEventListener('click', () => {
                controlMode = 'POINTER';
                document.querySelector('#drawing-controls').style.display = 'none';
            });

            document.querySelector('#drawing-eraser').addEventListener('click', () => {
                drawableMode = 'ERASER';
            });
            
            document.querySelector('#drawing-freedraw').addEventListener('click', () => {
                drawableMode = 'FREEDRAW';
            });

            document.querySelector('#drawing-highlighter').addEventListener('click', () => {
                drawableMode = 'HIGHLIGHT';
            });
            
            document.querySelector('#drawing-rectangle').addEventListener('click', () => {
                drawableMode = 'RECTANGLE';
            });

            document.querySelector('#drawing-undo').addEventListener('click', () => {
                socket.emit('SEND_UNDO', code);
            });

            document.addEventListener('mousedown', event => {
                if (event.button == 0) {
                    let rect = canvas.getBoundingClientRect();
                    let mouseX = event.clientX - rect.left;
                    let mouseY = event.clientY - rect.top;

                    penDown = true;
                    if (controlMode == 'DRAWING') {
                        drawableInfos[drawableMode].mousedown(mouseX, mouseY);
                        socket.emit('SEND_DRAW', currentDrawing, code);
                    } else if (controlMode == 'POINTER') {
                        socket.emit('SEND_POINTER', { x: mouseX / canvas.width, y: mouseY / canvas.height }, code);
                    }
                }
            });

            document.addEventListener('mousemove', event => {
                if (penDown) {
                    let rect = canvas.getBoundingClientRect();
                    let mouseX = event.clientX - rect.left;
                    let mouseY = event.clientY - rect.top;

                    if (controlMode == 'DRAWING') {
                        drawableInfos[drawableMode].mousemove(mouseX, mouseY);
                        socket.emit('SEND_DRAW', currentDrawing, code);
                    } else if (controlMode == 'POINTER') {
                        socket.emit('SEND_POINTER', { x: mouseX / canvas.width, y: mouseY / canvas.height }, code);
                    }
                }
            });

            document.addEventListener('mouseup', event => {
                if (event.button == 0) {
                    penDown = false;
                    if (controlMode == 'DRAWING') {
                        currentDrawing = null;
                        socket.emit('SEND_DRAW', currentDrawing, code);
                    } else if (controlMode == 'POINTER') {
                        socket.emit('SEND_POINTER', null, code);
                    }
                }
            });

            getImages(code).then(imgs => {
                images = imgs;
                renderCurrentSlide();
            });
        } else {
            localStorage.clear();
            window.location.href = window.location.origin;
        }
    });
});

const renderCurrentSlide = () => {
    if (globalState) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[globalState.currentSlide], 0, 0, canvas.width, canvas.height);

        // draw all currently on screen
        let drawables = globalState.drawingSurfaces[globalState.currentSlide].drawables;
        for (let i = 0; i < drawables.length; i++) {
            drawableInfos[drawables[i].type].render(context, drawables[i].data);
        }

        // draw all live drawings
        let currentDrawables = globalState.drawingSurfaces[globalState.currentSlide].current;
        Object.values(currentDrawables).forEach(drawable => {
            if (drawable) drawableInfos[drawable.type].render(context, drawable.data);
        });

        // draw all pointers
        Object.values(globalState.pointers).forEach(pointer => {
            if (pointer) {
                context.fillStyle = '#f00';
                context.beginPath();
                context.arc(pointer.x * canvas.width, pointer.y * canvas.height, 10, 0, 2 * Math.PI);
                context.closePath();
                context.fill();
            }
        });
    }
}

/**
 * Checks to see if code is there or presentation is still active
 * 
 * @param {string} code
 * @returns {Promise<boolean>} Whether or not code is valid or not 
 */
const checkValidity = async code => {
    if (code == null || code == '') return false;

    const response = await fetch(window.location.origin + `/presentations/${code}`);
    if (response.status != 200) return false;
    return true;
}

/**
 * Gets the images from the presentation
 * 
 * @param {string} code
 * @returns {Promise<List<Image>>} List of all images to render
 */
const getImages = async code => {
    const response = await fetch(window.location.origin + `/presentations/${code}`);
    const presentationInfo = await response.json();

    currentSlide = presentationInfo.currentSlide;

    let newImages = new Array();
    for (let i = 1; i <= presentationInfo.count; i++) {
        const imageResponse = await fetch(window.location.origin + `/presentations/${code}/${i}.jpg`);
        const image = await imageResponse.blob();
        
        let newImage = new Image(); 
        newImage.src = URL.createObjectURL(image);

        newImages.push(newImage);
    }

    return newImages;
}