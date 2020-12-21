export class dateService {
    constructor() { }
    
    /**
     * Gets curr date
     * @param timestamp 
     * @returns  
     */
    getCurrDate(timestamp: number) {
        return new Date(timestamp * 1000);
    }
}