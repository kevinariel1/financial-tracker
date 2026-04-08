const parseReceiptText = (text) => {
    const result = { amount: "", date: "", category: "" };
    
    if (!text) return result;

    // 1. Regex for Amount
    // Find numbers that look like prices, e.g., 12.34, 1,234.56, 12,34
    // We try to extract the highest logical amount (Total).
    const amountMatches = text.match(/\b\d{1,3}(?:[.,]\d{3})*[.,]\d{2}\b/g);
    if (amountMatches) {
        const amounts = amountMatches.map(m => {
            // Replace comma thousands separator with empty string and comma decimal with dot
            let normalized = m;
            if (m.lastIndexOf(',') > m.lastIndexOf('.')) {
                // Comma is likely the decimal separator
                normalized = m.replace(/\./g, '').replace(',', '.');
            } else {
                // Dot is decimal
                normalized = m.replace(/,/g, '');
            }
            return parseFloat(normalized);
        }).filter(n => !isNaN(n));

        if (amounts.length > 0) {
            const maxAmount = Math.max(...amounts);
            if (maxAmount > 0) {
                result.amount = maxAmount.toFixed(2);
            }
        }
    }

    // 2. Regex for Date
    const dateRegex = /\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b/;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
        result.date = dateMatch[1]; 
    }

    // 3. Category matching
    const normalizedText = text.toLowerCase();
    const categories = {
        Food: ["coffee", "starbucks", "restaurant", "cafe", "food", "mcdonalds", "burger king", "kfc", "pizza", "dining", "subway"],
        Transportation: ["shell", "petron", "gas", "taxi", "uber", "grab", "train", "bus", "parking", "fuel", "lyft", "chevron", "mobil"],
        Groceries: ["walmart", "target", "supermarket", "grocery", "tesco", "kroger", "safeway", "aldi", "mart", "costco", "whole foods"],
        Utilities: ["electric", "water", "internet", "bill", "telecom"],
        Shopping: ["mall", "store", "amazon", "retail", "ikea", "best buy"],
        Health: ["pharmacy", "cvs", "walgreens", "clinic", "hospital", "doctor", "dental"],
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => normalizedText.includes(keyword))) {
            result.category = category;
            break;
        }
    }

    return result;
};

module.exports = { parseReceiptText };
