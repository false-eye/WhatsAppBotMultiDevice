const { getGroupData, createGroupData, group } = require('../../../mongo-DB/groupDataDb');

module.exports.command = () => {
    let cmd = ["count"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { sendMessageWTyping } = msgInfoObj;
    group.findOne({ _id: from }).then(res => {
        group.aggregate([
            { $match: { _id: from } },
            { $unwind: "$members" },
            { $sort: { "members.count": -1 } },
            { $group: { _id: "$_id", items: { $push: "$members" } } }
        ]).toArray().then(r => {
            let mess = "*Group:* ```" + res.grpName + "```\n*Database From Nov 12, 22* \n*Total :* " + res.
                totalMsgCount + " From Oct 19, 22" + '\n\n';
            r[0].items.forEach(element => {
                mess += element.count + " - ```" + element.name + '```\n'
            });
            sendMessageWTyping(from, { text: mess }, { quoted: msg });
        });
    })
}