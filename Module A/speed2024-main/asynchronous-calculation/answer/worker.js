self.onmessage = e => {
    self.postMessage({
        type: "result",
        data: sumNumber(e.data),
    });
}

function sumNumber(n) {
    let result = 0;
    let beforeValue = 0;

    for (let i = 1; i <= n; i++) {
        const percentage = Math.floor(i / n * 100);

        if (beforeValue !== percentage) {
            self.postMessage({
                type: "calc",
                data: percentage + "%",
            });
            beforeValue = percentage;
        }

        result += i;
    }

    return result;
}