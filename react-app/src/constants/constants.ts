export const BASE_URL = "http://localhost:8000";
export const WINDOWPHONESIZE = 600;

export const HOME_SECTIONS = {
    HOME: {
        name: "home",
        linkLabel: "Home",
    },
    PLAYERS: {
        name: "players",
        linkLabel: "Players",
    },
    TEAMS: {
        name: "teams",
        linkLabel: "Teams",
    },
    MATCHES: {
        name: "matches",
        linkLabel: "Matches",
    },
}

export const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nis";

//generic type function
export const sliceArray = <T>(array: T[] , size: number): T[][] => {
    const slicedArray: T[][] = [];
    for(let i = 0; i < array.length; i += size) {
        slicedArray.push(array.slice(i, i + size));
    }
    return slicedArray;
}