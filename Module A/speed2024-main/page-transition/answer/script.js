window.onload = () => {
    window.navigation.addEventListener("navigate", function (event) {
        event.intercept({
            handler() {
                document.startViewTransition(async () => await changeBody(event.destination.url));
            }
        })
    })
}

async function changeBody(toUrl) {
    const url = new URL(toUrl);

    const htmlString = await fetch(url).then(response => response.text());

    const parser = new DOMParser();
    const newBody = parser.parseFromString(htmlString, "text/html").body;

    document.documentElement.replaceChild(newBody, document.body);
}