async function sendData (endpoint_url, data) {
    const response = await fetch(endpoint_url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
    });
    const text = await response.text();
    return text;
}
// const data = {"points_earned":1,"words_played":["tide"],"total_points":"237"}
// await postData("127.0.0.1:5000/save/" + 20260515, data)