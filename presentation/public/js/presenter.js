const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let code = '';
let images = [];
let currentSlide = -1;

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    code = urlParams.get('code');

    checkValidity(code).then(valid => {
        if (valid) {
            document.title = `prsntly.live - ${code}`;

            getImages(code).then(imgs => {
                images = imgs;
                renderCurrentSlide();
            });
        } else {
            window.location.href = window.location.origin;
        }
    });
});

const renderCurrentSlide = () => {
    context.drawImage(images[currentSlide], 0, 0, canvas.width, canvas.height);
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