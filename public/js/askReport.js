let file = {
    fileName: '',
    txtFileName: '',
}

const request = async () => {
    try {
        const response = await axios.post('/report', {
            reportId,
        });
        if(response.data.done == 0) {
            document.querySelector('#report').innerHTML = `Loading... ${response.data.percent}% finished`;
        } else if(response.data.done == 1) {

            document.querySelector('#report').innerHTML = '';
            let index = 1;
            response.data.reportList.forEach((eachError) => {
                document.querySelector('#report').innerHTML += `
                <div class="error_msg">
                    <div class="card-body alert-danger">
                        <b>ERROR ${index}:</b><br>
                        <p>${eachError}</p>
                    </div>
                </div>
                `;
                index++;
            });

            file.fileName = response.data.fileName;
            file.txtFileName = response.data.txtFileName;

            if(response.data.reportList.length == 0) {
                document.querySelector('#report').innerHTML = `<div class = 'alert alert-success'>Nothing is wrong with the document.</div>`;
            } else {
                document.querySelector('#report').innerHTML += `
                <form action="/report/download" method="post">
                    <input type="hidden" name="fileName" value="${file.fileName}">
                    <input type="hidden" name="txtFileName" value="${file.txtFileName}">
                    <button class="mt-2" type="submit">Download the report as txt.</button>
                </form>`;
            }

            clearInterval(interval);

        } else if(response.data.done == -1) {
            document.querySelector('#report').innerHTML = `[Me] Something is wrong with this file analysis`;
        }


    } catch (error) {
        console.log(error.response);
    }
    console.log(1);
};

const interval = setInterval(request, 100);