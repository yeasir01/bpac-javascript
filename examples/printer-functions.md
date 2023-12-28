# Printer Functions

1. ### Get printer identifier

    ```javascript
    import { BrotherSdk } from "./lib/index.js";

    const sdk = new BrotherSdk();

    const getPrinterId = async () => {
        try {
            const doc = await sdk.onExtensionReady();
            const id = await doc.getPrinterIdentifier();
            console.log(id); //Output: 1819400270304
        } catch (err) {
            console.log(err);
        }
    };

    getPrinterId();
    ```

2. ### Get List of printers

    ```javascript
    import { BrotherSdk } from "./lib/index.js";

    const sdk = new BrotherSdk();

    const getPrinterList = async () => {
        try {
            const doc = await sdk.onExtensionReady();
            const printers = await doc.getInstalledPrinters();
            console.log(printers); //Output: (2) ['Brother QL-820NWB', 'Brother PT-9800PCN']
        } catch (err) {
            console.log(err);
        }
    };

    getPrinterList();
    ```
