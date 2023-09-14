const puppeteer = require("puppeteer");

const SELECTORS = {
    LOGGED_IN: "._3WByx",
    UNREAD: "span[aria-label='Unread']",
    CONTACT_LIST_ITEM: (contactName) => `span[title='${contactName}']`,
    MESSAGE_INPUT: "div[tabindex='-1']",
    SEND_BUTTON: "button[aria-label='Send']",
    LAST_MESSAGE: "div[role='application'] div[role='row']:last-child span.selectable-text span"
};

(async function main() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto("https://web.whatsapp.com/");
        await waitForSelector(page, SELECTORS.LOGGED_IN, 0);

        while (true) {
            try {
                await waitForSelector(page, SELECTORS.UNREAD);
                await page.click(SELECTORS.UNREAD);

                // Evaluate the text content of the last message
                const lastMessageText = await page.evaluate((selector) => {
                    const lastMessageElement = document.querySelector(selector);
                    return lastMessageElement ? lastMessageElement.textContent : null;
                }, SELECTORS.LAST_MESSAGE);

                await handleUnreadMessages(page, lastMessageText)

            } catch (e) {
                console.error(getCurrentDateTime() + " No new messages");
                console.error(e);
            }
            await delay(1000);
        }
    } catch (e) {
        console.error("Error: ", e);
    }
})();

async function handleUnreadMessages(page, text) {
    let messageType;

    switch (text) {
        case "HALO":
            messageType = "START"
            break;
        case "123":
            messageType = "VERIFICATION"
            break;
        case "KENAPA":
            messageType = "QUESTION"
            break;
        default:
            messageType = "UNKNOWN"
            break;
    }

    if (messageType === "START") {
        await typeAndSendMessage(page, "Silahkan Masukkan NIK")
    }
    if (messageType === "VERIFICATION") {
        await typeAndSendMessage(page, "NIK Anda Terverfikasi")
    }
    if (messageType === "QUESTION") {
        await typeAndSendMessage(page, "Selamat Tiket anda #ABC123")
    }
    if (messageType === "UNKNOWN") {
        await typeAndSendMessage(page, "Pertanyaan tidak dikenali")
    }
}

async function typeAndSendMessage(page, message) {
    const editor = await page.$(SELECTORS.MESSAGE_INPUT);
    await editor.focus();
    await page.evaluate((message) => {
        document.execCommand("insertText", false, message);
    }, message);
    await page.click(SELECTORS.SEND_BUTTON);
}

async function waitForSelector(page, selector, timeout = 30000) {
    await page.waitForSelector(selector, { timeout: timeout });
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

function getCurrentDateTime() {
    const now = new Date();
    return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
}
