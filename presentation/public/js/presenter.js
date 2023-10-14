const socket = io();

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const connectMessageSpan = document.querySelector('#connect-message');

let uuid = '';
let code = '';
let images = [];

let globalState = null;

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
        context.drawImage(images[globalState.currentSlide], 0, 0, canvas.width, canvas.height);
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
 * @returns {Promise<List<Image>>} Whether or not code is valid or not 
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