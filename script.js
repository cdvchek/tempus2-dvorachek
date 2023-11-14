import fetch from "node-fetch";
import fs from "fs";

const serverEnd = "https://tempus2.xyz/api/v0";
const playerId = 213159;

const wrapper = async () => {
    // const mapsRawData = await fetch(`${serverEnd}/maps/list`);
    // const maps = await mapsRawData.json();
    // const mapNames = maps.map((map) => {
    //     return map.name;
    // });

    // const soldierInfo = [];
    // const demoInfo = [];

    // for (let i = 0; i < mapNames.length; i++) {
    //     const mapName = mapNames[i];

    //     const soldierRaw = await fetch(`${serverEnd}/maps/name/${mapName}/zones/typeindex/map/1/records/player/${playerId}/3`);
    //     const soldier = await soldierRaw.json();
    //     const soldierResult = soldier.result;

    //     if (soldierResult) {
    //         const soldierDuration = soldierResult.duration;
    //         const soldierRank = soldierResult.rank;
    //         const soldierObj = { map: mapName, duration: soldierDuration, rank: soldierRank};
    //         soldierInfo[i] = soldierObj;
    //     }

    //     const demoRaw = await fetch(`${serverEnd}/maps/name/${mapName}/zones/typeindex/map/1/records/player/${playerId}/4`);
    //     const demo = await demoRaw.json();
    //     const demoResult = demo.result;
        
    //     if (demoResult) {
    //         const demoDuration = demoResult.duration;
    //         const demoRank = demoResult.rank;
    //         const demoObj = { map: mapName, duration: demoDuration, rank: demoRank};
    //         demoInfo[i] = demoObj;
    //     }

    //     console.log("Finished: ", i + 1, `${((i + 1)/mapNames.length) * 100}%`);
    // }

    let mapData;

    fs.readFile("beck.txt", 'utf8', (err, data) => {
        // console.log(data);
        mapData = JSON.parse(data);

        const soldierInfo = mapData[0];
        const demoInfo = mapData[1];

        let csvString = "";

        for (let i = 0; i < soldierInfo.length; i++) {
            const soldierMap = soldierInfo[i];
            
            if (soldierMap) {
                csvString = csvString + soldierMap.map + ",";
                csvString = csvString + soldierMap.duration + ",";
                csvString = csvString + soldierMap.rank + "\n";
            }
        }

        csvString = csvString + "\n";

        for (let i = 0; i < demoInfo.length; i++) {
            const demoMap = demoInfo[i];
            
            if (demoMap) {
                csvString = csvString + demoMap.map + ",";
                csvString = csvString + demoMap.duration + ",";
                csvString = csvString + demoMap.rank + "\n";
            }
        }

        fs.writeFile('beck.csv', csvString, 'utf8', (err) => {
            if (err) throw err;
        });
    });
}

wrapper();