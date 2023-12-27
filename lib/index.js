"use strict";

const appendMessage = (obj) => {
    const event = new CustomEvent("bpac_send", { detail: obj });
    document.dispatchEvent(event);
};

/**
 * Represents a printer in the b-PAC system.
 */
class IPrinter {
    /**
     * Constructs an IPrinter instance.
     * @param {number} printer - The identifier of the printer.
     */
    constructor(printer) {
        this.printer = printer;
    }

    /**
     * Retrieves a list of installed printers.
     * @returns {Promise<string[]>} A Promise that resolves with an array of installed printer names
     *                              or rejects with an error message if there is a failure.
     */
    getInstalledPrinters() {
        const eventName = "IPrinter::GetInstalledPrinters";
        const request = { method: eventName, p: this.printer };

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

        appendMessage(request);

        return printer;
    }
}

export class BrotherSdk {
    constructor() {}

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
     *@example
     *"C:\\templates\\templateFileName.lbx"
     */
    open(path) {
        const eventName = "IDocument::Open";
        const request = { method: eventName, filePath: path };

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

        appendMessage(request);

        return doc;
    }

    /**
     * Retrieves the printer associated with the current document.
     * @returns {Promise<IPrinter>} A Promise that resolves with an IPrinter object representing the printer
     *                              or rejects with an error message if there is a failure.
     */
    getPrinter() {
        const eventName = "IDocument::GetPrinter";
        const request = { method: eventName };

        const printer = new Promise((resolve, reject) => {
            const handler = (e) => {
                document.removeEventListener(eventName, handler);

                if (e.detail.ret === false || e.detail.connect === false) {
                    reject("Unable to connect to printer");
                } else if (e.detail.p >= 0) {
                    const printerObject = new IPrinter(e.detail.p);
                    resolve(printerObject);
                } else {
                    reject();
                }
            };

            document.addEventListener(eventName, handler);
        });

        appendMessage(request);

        return printer;
    }

    /**
     * Retrieves the name of the printer associated with the current document.
     * @returns {Promise<string>} A Promise that resolves with the printer name
     *                            or rejects with an error message if there is a failure.
     */
    getPrinterName() {
        const eventName = "IDocument::GetPrinterName";
        const request = { method: eventName };

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

        appendMessage(request);

        return printer;
    }
}
