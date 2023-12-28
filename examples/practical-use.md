# Practical Use

1. ### Preview a label

    ```javascript
    import { BrotherSdk } from "./lib/index.js";

    const sdk = new BrotherSdk();
    const filePath = "C:\\Templates\\shelf_tag.lbx";

    const imgPreview = async () => {
        try {
            const doc = await sdk.onExtensionReady(); // When ready return an instance
            const isOpen = await doc.open(filePath); // Open document

            if (isOpen) {
                const imgElement = document.querySelector("#img"); // Grab img element
                const base64Img = await doc.getImageData(0, 240); // Set width and heigh [0=auto]
                imgElement.src = base64Img; //Set source attribute on element.

                await doc.close(); //Always call this after opening the doc.
            } else {
                throw Error("Document did not open.");
            }
        } catch (err) {
            console.log(err);
        }
    };

    imgPreview();
    ```
