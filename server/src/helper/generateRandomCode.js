export const generatePlayerId = () => {
    return Math.random().toString(36).substring(2, 9);
}

export const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 11);
}