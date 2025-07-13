
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');


const app = express();
const port = 3000;

async function fetchDividendData() {
    const url = "https://www.moneycontrol.com/markets/corporate-action/dividends_declared/";
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    try {
        const response = await axios.get(url, { headers, timeout: 15000 });
        const $ = cheerio.load(response.data);

        const card_container = $('div.lhsGrayCard_web_grayBoxMain__3uS2_');
        if (card_container.length === 0) {
            console.log("Could not find the main dividend data container (div.lhsGrayCard_web_grayBoxMain__3uS2_). The website structure may have changed.");
            return null;
        }

        const dividend_cards = card_container.find('div.lhsGrayCard_web_lhsGrayCard__RSkQw');
        if (dividend_cards.length === 0) {
            console.log("Could not find any dividend cards (div.lhsGrayCard_web_lhsGrayCard__RSkQw) on the page.");
            return null;
        }

        const data_rows = [];
        dividend_cards.each((i, card) => {
            try {
                const company_tag = $(card).find('a.lhsGrayCard_web_title__B2NJA');
                const company_name = company_tag.text().trim() || 'N/A';

                const values = $(card).find('span.lhsGrayCard_web_values__DQOxi');

                const ltp_section = $(card).find('div.lhsGrayCard_web_secondRow__BulOS').find('div.lhsGrayCard_web_lhs__Bh6QQ');
                const ltp_value_str = ltp_section.find('span.lhsGrayCard_web_values__DQOxi').text().trim();
                const ltp_value = parseFloat(ltp_value_str.replace(/,/g, '')) || 0.0;

                const change_red = ltp_section.find('span.lhsGrayCard_web_redtext__dd7oX');
                const change_green = ltp_section.find('span.lhsGrayCard_web_greentext__zbrAw');
                const change_gray = ltp_section.find('span.lhsGrayCard_web_graytext__Qgy9W');

                let ltp_full = ltp_value_str;
                if (change_red.length > 0) {
                    ltp_full = `${ltp_value_str} ${change_red.text().trim()}`;
                } else if (change_green.length > 0) {
                    ltp_full = `${ltp_value_str} ${change_green.text().trim()}`;
                } else if (change_gray.length > 0) {
                    ltp_full = `${ltp_value_str} ${change_gray.text().trim()}`;
                }

                const dividend_str = values.eq(1).text().trim() || '0.0';
                const dividend = parseFloat(dividend_str) || 0.0;

                const ann_date_str = values.eq(2).text().trim() || 'N/A';
                const ex_date_str = values.eq(3).text().trim() || 'N/A';

                data_rows.push({
                    'Company': company_name,
                    'LTP & Change': ltp_full,
                    'LTP': ltp_value,
                    'Dividend (Rs)': dividend,
                    'Ann. Date': ann_date_str,
                    'Ex-Date': ex_date_str
                });
            } catch (e) {
                // console.log(`Skipping a card due to parsing error: ${e}`);
            }
        });

        return data_rows;
    } catch (error) {
        console.error(`Error fetching the webpage: ${error}`);
        return null;
    }
}

app.get('/fetch', async (req, res) => {
    try {
        console.log("Fetching latest dividend data from Moneycontrol...");
        const raw_data = await fetchDividendData();

        if (raw_data) {
            const investment_amount = parseFloat(req.query.investment) || 10000;
            const processed_data = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const row of raw_data) {
                const { 'Company': company_name, 'LTP & Change': ltp_full, 'LTP': ltp, 'Dividend (Rs)': dividend_per_share, 'Ann. Date': ann_date_str, 'Ex-Date': ex_date_str } = row;

                let quantity = 0;
                let total_invested = 0.0;
                let total_dividend = 0.0;
                let status = "N/A";

                if (ltp > 0) {
                    quantity = Math.floor(investment_amount / ltp);
                    total_invested = parseFloat((quantity * ltp).toFixed(2));
                    total_dividend = parseFloat((quantity * dividend_per_share).toFixed(2));
                }

                try {
                    const [day, month, year] = ex_date_str.split('/');
                    const ex_date_dt = new Date(`${year}-${month}-${day}`);
                    ex_date_dt.setHours(0, 0, 0, 0);

                    if (ex_date_dt > today) {
                        status = "Active";
                    } else {
                        status = "Inactive";
                    }
                } catch (e) {
                    status = "Unknown Date";
                }

                processed_data.push({
                    'Company': company_name,
                    'LTP & Change': ltp_full,
                    'Dividend (Rs)': dividend_per_share.toFixed(2),
                    'Quantity': quantity,
                    'Total Amt Invested': total_invested.toFixed(2),
                    'Potential Dividend': total_dividend.toFixed(2),
                    'Status': status,
                    'Ex-Date': ex_date_str,
                    'Ann. Date': ann_date_str
                });
            }
            res.json(processed_data);
        } else {
            res.status(500).json({ error: "Failed to retrieve or parse data. The website layout may have changed again." });
        }
    } catch (error) {
        console.error(`
An unexpected error occurred: ${error}`);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
