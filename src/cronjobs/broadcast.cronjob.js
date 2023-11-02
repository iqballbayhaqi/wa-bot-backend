const BroadcastService = require("../services/broadcast.service");
const MessageService = require("../services/message.service");

const broadcastJob = async () => {
    console.log("Running broadcast job ....")
    const broadcast = await BroadcastService.getUncompletedBroadcast();

    if (broadcast) {
        const { id, numberList, message } = broadcast[0];
        const numberListParsed = JSON.parse(numberList);
        const numberListFiltered = numberListParsed.filter(number => !number.isSent).map(item => item.phoneNumber);
        let numberListToSend = [];

        if (numberListFiltered.length >= broadcastQuota) {
            numberListToSend = numberListFiltered.slice(0, broadcastQuota);
        } else {
            numberListToSend = numberListFiltered.slice(0, numberListFiltered.length);
        }

        for (let i = 0; i < numberListToSend.length; i++) {
            if (i <= broadcastQuota) {
                const number = numberListToSend[i];
                await MessageService.sendMessage(number, message);
                const index = numberListParsed.findIndex(item => item.phoneNumber === number);
                numberListParsed[index].isSent = true;
                sentMessages++;
            } else {
                break;
            }
        }

        if (sentMessages >= broadcastQuota && broadcastQuota < maximumBroadcastQuota) {
            broadcastQuota += 5;
        }

        // check if every number is sent in numberlistparsed
        const isComplete = numberListParsed.every(item => item.isSent === true);

        if (isComplete) {
            const numberListUpdated = JSON.stringify(numberListParsed);
            await BroadcastService.updateBroadcast(id, numberListUpdated, isComplete);
        } else {
            const numberListUpdated = JSON.stringify(numberListParsed);
            await BroadcastService.updateBroadcast(id, numberListUpdated, isComplete);
        }

        sentMessages = 0;


        let newQuota = broadcastQuota;
        let sentMsg = sentMessages;

        return { newQuota, sentMsg }
    }
}

module.exports = broadcastJob;