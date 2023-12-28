"use strict";

const dispatch = (message) => {
    const event = new CustomEvent("bpac_send", { detail: message });
    document.dispatchEvent(event);
};

export class BrotherSdk {
    constructor() {
        this.printer = null;
    }

    setPrint(printIdentifier) {
        this.printer = printIdentifier;
    }

    /**
     * Checks if the b-PAC extension is installed by inspecting the presence of a specific class in the document body.
     * @returns {boolean} True if the b-PAC extension is installed, otherwise false.
     */
    isExtensionInstalled() {
        return document.body.classList.contains("bpac-extension-installed");
    }

    /**
     * Checks if the current browser is a supported browser for the b-PAC functionality.
     * @returns {boolean} True if the browser is supported, otherwise false.
     */
    isSupportedBrowser() {
        const agent = window.navigator.userAgent.toLowerCase();
        const isSupported =
            agent.indexOf("chrome") !== -1 &&
            agent.indexOf("edge") === -1 &&
            agent.indexOf("opr") === -1;
        return isSupported;
    }

    /**
     * Opens a document with the specified file path.
     * @param {string} filePath - The path to the document to be opened.
     * @returns {Promise<any>} A Promise that resolves with the result of the document opening operation
     *                        or rejects with an error message if there is a failure.
     *@throws {Error} Throws an error with a descriptive message if unable to open the document.
     *
     *@example
     *"C:\\templates\\templateFileName.lbx"
     */
    open(path) {
        const eventName = "IDocument::Open";
        const message = { method: eventName, filePath: path };

        const doc = new Promise((resolve, reject) => {
            const handler = (e) => {
                document.removeEventListener(eventName, handler);

                if (e.detail.connect === false) {
                    reject("Unable to open the document");
                } else {
                    resolve(e.detail.ret);
                }
            };

            document.addEventListener(eventName, handler);
        });

        dispatch(message);
        return doc;
    }

    /**
     * Retrieves the identifier of the printer associated with the current document.
     *
     * @returns {Promise<number>} A Promise that resolves with the printer identifier when the information is retrieved,
     *                            or rejects with an error message if there is a failure.
     *
     * @throws {Error} Throws an error with a descriptive message if unable to connect to the printer or if an unexpected response is received.
     *
     */
    getPrinterIdentifier() {
        const eventName = "IDocument::GetPrinter";
        const message = { method: eventName };

        const printer = new Promise((resolve, reject) => {
            const handler = (e) => {
                document.removeEventListener(eventName, handler);

                if (e.detail.ret === false || e.detail.connect === false) {
                    reject("Unable to connect to printer.");
                } else if (e.detail.p >= 0) {
                    this.setPrint(e.detail.p);
                    resolve(this.printer);
                } else {
                    reject(
                        "An unexpected error occurred when attempting to connect."
                    );
                }
            };

            document.addEventListener(eventName, handler);
        });

        dispatch(message);
        return printer;
    }

    /**
     * Retrieves a list of installed printers.
     * @returns {Promise<string[]>} A Promise that resolves with an array of installed printer names
     *                              or rejects with an error message if there is a failure.
     */
    getInstalledPrinters() {
        const eventName = "IPrinter::GetInstalledPrinters";
        const message = { method: eventName, p: this.printer };

        const printer = new Promise((resolve, reject) => {
            const handler = (e) => {
                document.removeEventListener(eventName, handler);

                if (e.detail.ret === false || e.detail.connect == false) {
                    reject("Unable to retrieve installed printers");
                } else {
                    resolve(e.detail.printers);
                }
            };

            document.addEventListener(eventName, handler);
        });

        dispatch(message);

        return printer;
    }

    /**
     * Retrieves the name of the printer associated with the current document.
     * @returns {Promise<string>} A Promise that resolves with the printer name
     *                            or rejects with an error message if there is a failure.
     */
    getPrinterName() {
        const eventName = "IDocument::GetPrinterName";
        const message = { method: eventName };

        const printer = new Promise((resolve, reject) => {
            const handler = (e) => {
                document.removeEventListener(eventName, handler);
                if (e.detail.ret === false || e.detail.connect === false) {
                    reject("Unable to get printer name.");
                } else {
                    resolve(e.detail.name);
                }
            };

            document.addEventListener(eventName, handler);
        });

        dispatch(message);
        return printer;
    }

    /**
     * Checks if a specific printer is online by sending a request to the b-PAC system.
     *
     * @param {string} printerName - The name of the printer to check for online status.
     * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating whether the printer is online,
     *                            or rejects with an error message if there is a failure.
     *
     * @throws {Error} Throws an error with a descriptive message if unable to connect to the printer or if an unexpected response is received.
     *
     * @example
     * // Create an instance of YourClass
     * const sdk = new BrotherSdk();
     *
     * // Call the isPrinterOnline method with a printer name
     * sdk.isPrinterOnline("YourPrinterName")
     *     .then((onlineStatus) => {
     *         if (onlineStatus) {
     *             console.log("Printer is online.");
     *         } else {
     *             console.log("Printer is offline.");
     *         }
     *     })
     *     .catch((error) => {
     *         console.error("Error checking printer status:", error.message);
     *     });
     */
    isPrinterOnline(printerName) {
        const eventName = "IPrinter::IsPrinterOnline";
        const message = {
            method: eventName,
            p: this.printer,
            name: printerName,
        };

        const isOnline = new Promise((resolve, reject) => {
            const handler = (e) => {
                console.log(e);
                document.removeEventListener(eventName, handler);
                if (e.detail.connect === false) {
                    reject(`Unable to connect to ${printerName}.`);
                } else {
                    resolve(e.detail.ret);
                }
            };

            document.addEventListener(eventName, handler);
        });

        dispatch(message);
        return isOnline;
    }

    /**
     * Waits for the b-PAC extension to be ready by checking for the presence of a specific class on the document body.
     *
     * @returns {Promise<BrotherSdk>} A Promise that resolves with the instance of BrotherSdk when the extension is ready,
     *                               or rejects with an error message if the extension is not ready within the specified time.
     * @throws {Error} Throws an error with a descriptive message if the extension is not ready within the specified time.
     *
     * @example
     * import { BrotherSdk } from "../lib/brother_sdk.js";
     *
     * const sdk = new BrotherSdk();
     *
     * sdk.onExtensionReady()
     *     .then((instance) => {
     *         console.log("bPac Instance:", instance);
     *     })
     *     .catch((err) => {
     *         console.log(err);
     *     });
     */
    onExtensionReady() {
        const promise = new Promise((resolve, reject) => {
            const targetNode = document.body;
            const className = "bpac-extension-installed";

            if (targetNode.classList.contains(className)) {
                return resolve(this);
            }

            let observer;
            let timeoutId;

            const cleanup = () => {
                if (observer) {
                    observer.disconnect();
                }

                clearTimeout(timeoutId);
            };

            observer = new MutationObserver(() => {
                if (targetNode.classList.contains(className)) {
                    resolve(this);
                    cleanup();
                }
            });

            observer.observe(targetNode, {
                attributes: true,
                attributeFilter: ["class"],
            });

            timeoutId = setTimeout(() => {
                reject(
                    "Timeout: The b-PAC extension may not be installed or active."
                );
                cleanup();
            }, 4000);
        });

        return promise;
    }
}
