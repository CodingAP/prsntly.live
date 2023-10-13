const presentationInput = document.querySelector('#presentation-input');
const uploadStatusSpan = document.querySelector('#upload-status');

presentationInput.addEventListener('change', () => {
    const file = presentationInput.files[0];

    if (file !== null) {
        uploadStatusSpan.innerHTML = 'Uploading presentation...'
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = async event => {
            // generate code
            const content = event.target.result;

            const request = await fetch('api/create-presentation?filename=' + file.name, {
                method: 'POST',
                headers: {
                    'content-type': 'application/octet-stream',
                    'content-length': content.length,
                },
                body: content
            });

            const response = await request.json();
            if (response.status != 200) {
                uploadStatusSpan.innerHTML = response.message;
            } else {
                if (response.data != null) {
                    window.location += `presenter?code=${response.data}`;
                }
            }
        }
    }
});