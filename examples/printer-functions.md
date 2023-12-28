# Printer Functions

1. ### Get printer object
    ```javascript
    import { BrotherSdk } from "./lib/index.js";

    const sdk = new BrotherSdk();

    const getPrinterObject = async () => {
        try {
            const doc = await sdk.onExtensionReady();
            const printerObject = await doc.getPrinter();
            console.log(printerObject); //Output: IPrinter {printer: 1819400270304, ...}
        } catch (err) {
            console.log(err);
        }
    };

    getPrinterObject();
    ```
2. ### Get List of printers
    ```javascript
    import { BrotherSdk } from "./lib/index.js";

    const sdk = new BrotherSdk();

    const getPrinterList = async () => {
        try {
            const doc = await sdk.onExtensionReady();
            const printerObject = await doc.getPrinter();
            const printers = await printerObject.getInstalledPrinters();
            console.log(printers); //Output: (2) ['Brother QL-820NWB', 'Brother PT-9800PCN']
        } catch (err) {
            console.log(err);
        }
    };

    getPrinterList();
    ```