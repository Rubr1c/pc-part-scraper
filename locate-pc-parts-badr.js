const puppeteer = require("puppeteer");

async function getResultsBadr(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1024 });
    await page.goto(url, { waitUntil: "networkidle2" });

    const products = await page.evaluate(async () => {
        const product_data = {};
        let previousHeight = 0;
        let newHeight = document.body.scrollHeight;

        async function loadMoreProducts() {
            window.scrollBy(0, document.body.scrollHeight);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        while (previousHeight !== newHeight) {
            previousHeight = newHeight;

            const productDivs = document.querySelectorAll("div.product-layout");
            productDivs.forEach((productDiv) => {
                if (!productDiv.closest("footer")) {
                    const captionDiv = productDiv.querySelector("div.caption");

                    const name = captionDiv
                        .querySelector("div.name")
                        .querySelector("a");

                    product_data[name.innerText.trim()] = {};
                    product_data[name.innerText.trim()].website = "elbadrgroup";

                    const priceDiv = captionDiv.querySelector("div.price");

                    const price = priceDiv.querySelector("span.price-normal");

                    if (price) {
                        product_data[name.innerText.trim()].price =
                            price.innerText;
                    } else {
                        const oldPrice =
                            priceDiv.querySelector("span.price-old");
                        const newPrice =
                            priceDiv.querySelector("span.price-new");

                        product_data[name.innerText.trim()].price = {};
                        product_data[name.innerText.trim()].price.old_price =
                            oldPrice.innerText;
                        product_data[name.innerText.trim()].price.new_price =
                            newPrice.innerText;
                    }
                }
            });

            await loadMoreProducts();

            newHeight = document.body.scrollHeight;
        }

        return product_data;
    });

    await browser.close();

    return products;
}

function getResults(item) {
    switch (item.catagory) {
        case "cpu":
            if (item.filters.min && item.filters.max) {
                getResultsBadr(
                    `https://elbadrgroupeg.store/hardware/cpu?fmin=${item.filters.min}&fmax=${item.filters.max}`
                ).then((products) => {
                    console.log(products);
                });
            }
            break;
        case "motherboard":
            if (item.filters.min && item.filters.max) {
                getResultsBadr(
                    `https://elbadrgroupeg.store/hardware/motherboard?fmin=${item.filters.min}&fmax=${item.filters.max}`
                ).then((products) => {
                    console.log(products);
                });
            }
            break;
       case "cooling":
            if (item.filters.min && item.filters.max) {
                getResultsBadr(
                    `https://elbadrgroupeg.store/hardware/cooling?fmin=${item.filters.min}&fmax=${item.filters.max}`
                ).then((products) => {
                    console.log(products);
                });
            }
            break;
       case "ram":
            if (item.filters.min && item.filters.max) {
                getResultsBadr(
                    `https://elbadrgroupeg.store/ram?fmin=${item.filters.min}&fmax=${item.filters.max}`
                ).then((products) => {
                    console.log(products);
                });
            }
            break;
       case "case":
            if (item.filters.min && item.filters.max) {
                getResultsBadr(
                    `https://elbadrgroupeg.store/hardware/case?fmin=${item.filters.min}&fmax=${item.filters.max}`
                ).then((products) => {
                    console.log(products);
                });
            }
            break;
       case "gpu":
            if (item.filters.min && item.filters.max) {
                getResultsBadr(
                    `https://elbadrgroupeg.store/vga?fmin=${item.filters.min}&fmax=${item.filters.max}`
                ).then((products) => {
                    console.log(products);
                });
            }
            break;
    }
}

getResults({ catagory: "gpu", filters: { min: 25000, max: 37000 } });
