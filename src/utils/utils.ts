export const cln = (clsObject: object) => {
    return Object.entries(clsObject).filter(([,val]) => val).map(([key]) => key).join(" ");
}

export const getGameVersion = (ver: string) => {
    if(!ver) return "";

    //verze bez upravy pokud obsahuje tecku
    if(ver.includes(".")) {
        return ver;
    }

    //kompatibilita se starsim cislovanim
    return ver ? ver.substring(0, 1) + "." + ver.substring(1, ver.length) : "-";
}

export const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
}
