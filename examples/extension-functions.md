# Extension Functions

1. ### Check if extension is installed and active

    ```javascript
    import { BrotherSdk } from "./lib/index.js";

    const sdk = new BrotherSdk();

    const newInstance = async () => {
        try {
            const doc = await sdk.onExtensionReady(); //Resolves to an instance of <BrotherSdk>
        } catch (err) {
            console.log(err); //Throws an error if bpac extension is not installed or active.
        }
    };

    newInstance();
    ```

2. ### Check for supported browser

    ```javascript
    import { BrotherSdk } from "./lib/index.js";

    const sdk = new BrotherSdk();

    if (sdk.isSupportedBrowser()) {
        console.log("Your browser is supported");
    } else {
        console.log("Your browser is not supported");
    }
    ```
