import React, { useState, useEffect } from "react";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { Divider } from "../components/Divider";
import { Bottom } from "../components/Bottom";
import { Loader } from "../components/Loader";
import { Footer } from "../components/Footer";
import { Response } from "../components/Response";
import { Rating } from "../components/Rating";
import axios from "axios";
import DoughnutChartComponent from "../components/DoughnutChart";

function Extension() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [overallRatings, setOverallRatings] = useState(0);
    const [amazonUrl, setAmazonUrl] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [positiveRating, setPositiveRating] = useState(0);
    const [neutralRating, setNeutralRating] = useState(0);
    const [negativeRating, setNegativeRating] = useState(0);
    const data = [
        { value: neutralRating, name: 'Neutral' },
        { value: negativeRating, name: 'Negative' },
        { value: positiveRating, name: 'Positive' }
    ];

    useEffect(() => {   
        const checkIfButtonShouldBeDisabled = async () => {
            try {
                const result = await disableButton();
                setIsButtonDisabled(result);
            } catch (error) {
                console.error("Failed to get current tab URL", error);
                setIsButtonDisabled(true);
            }
        };
        checkIfButtonShouldBeDisabled();
    }, []);

    function isValidUrl(url) {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
        } catch (error) {
            return false;
        }
    }

    function disableButton() {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'getCurrentTabUrl' }, (response) => {
                if (response.url) {
                    const url = response.url;
                    const urlObj = new URL(url);
                    const hostname = urlObj.hostname;
                    const isAmazonPage = hostname.includes('amazon');
                    const isShopeePage = hostname.includes('shopee');
                    resolve(!(isAmazonPage || isShopeePage));
                } else {
                    reject(new Error("Failed to get current tab URL"));
                }
            });
        });
    }

    function cleanProductUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            if (hostname.includes('amazon')) {
                return cleanAmazonUrl(urlObj);
            } else if (hostname.includes('shopee')) {
                return cleanShopeeUrl(urlObj);
            }
            
            return url;
        } catch (error) {
            console.error(error.message);
            return url;
        }
    }

    function cleanAmazonUrl(urlObj) {
        let pathParts = urlObj.pathname.split('/');
        let asinIndex = pathParts.indexOf('dp');
        if (asinIndex === -1 || asinIndex + 1 >= pathParts.length) {
            throw new Error("ASIN not found");
        }

        let asin = pathParts[asinIndex + 1];
        let cleanUrl = `${urlObj.origin}/dp/${asin}`;

        return cleanUrl;
    }

    function cleanShopeeUrl(urlObj) {
        let pathname = urlObj.pathname;
        let match = pathname.match(/i\.(\d+)\.(\d+)/);
        if (match) {
            let shopId = match[1];
            let itemId = match[2];
            return `${urlObj.origin}/product/${shopId}/${itemId}`;
        }

        return urlObj.href;
    }

    let cleanUrl = null;
    const runScrapingScript = async () => {
        setOverallRatings(null);
        setPositiveRating(null);
        setNeutralRating(null);
        setNegativeRating(null);
        setResponse("");
        setLoading(true);
        chrome.runtime.sendMessage({ action: 'getCurrentTabUrl' }, async (response) => {
            if (response.url && isValidUrl(response.url)) {
                try {
                    cleanUrl = cleanProductUrl(response.url);
                    setAmazonUrl(cleanUrl);
                    const res = await axios.post('https://localhost:3001/scrape', { url: cleanUrl });
                    console.log('URL sent successfully:', res.data);

                    
                    const exisiting_summary = res.data.aiSummary?.['shortSummary'];
                 
                    const generated_summary = res.data.reactResponse?.aiSummary['shortSummary'];
                   

                    if (exisiting_summary !== undefined) {
                        setResponse(exisiting_summary);
                        
                        const Positive_Rating = res.data.summary['Percentage of Positive Reviews'];
                        const Negative_Rating = res.data.summary['Percentage of Negative Reviews'];
                        const Neutral_Rating = res.data.summary['Percentage of Neutral Reviews'];
                        if (Positive_Rating !== undefined) {
                            setOverallRatings(Positive_Rating);
                            setPositiveRating(Positive_Rating);
                            setNeutralRating(Neutral_Rating);
                            setNegativeRating(Negative_Rating);
                            setLoading(false);
                        }
                            
                    }
                    else if (generated_summary !== undefined) {
                        setResponse(generated_summary);
                        

                        // Start checking the database
                        checkDatabaseRepeatedly();
                        
                    }

                } catch (err) {
                    setLoading(false);
                    setResponse(err.massage);
                }
            }
        });
    };

    const checkDatabaseRepeatedly = () => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.post('https://localhost:3001/checkReport', { url: cleanUrl });
               
                if (res.status !== 404) {
                   
                    const Positive_Rating = res.data.summary['Percentage of Positive Reviews'];
                    const Negative_Rating = res.data.summary['Percentage of Negative Reviews'];
                    const Neutral_Rating = res.data.summary['Percentage of Neutral Reviews'];
                    if (Positive_Rating !== undefined) {
                        setOverallRatings(Positive_Rating);
                        setPositiveRating(Positive_Rating);
                        setNeutralRating(Neutral_Rating);
                        setNegativeRating(Negative_Rating);
                        setLoading(false);
                    }
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Error checking database:', error);
            }
        }, 3000); // Check every 3 seconds
    };

    const onClick = () => {
        runScrapingScript();
    };

    return (
        <Container.Outer className="flex flex-col min-h-screen" showIcon={true} showHeader={true} customStyles={{ minWidth: '300px', width: '100%', maxWidth: '400px', margin: '0 auto', maxHeight: '400px' }}>
            <Container.Inner className="flex flex-col flex-grow" customStyles={{ paddingTop: 15, paddingLeft: 20, paddingRight: 20, paddingBottom: 20, borderRadius: '1rem', overflowY: 'auto' }}>
                <Button isdisabled={isButtonDisabled} onClick={onClick} text="Scan comments now!" className="w-full py-4 text-xl font-bold text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <div className="flex flex-col space-y-2">
                    {loading ? <Loader /> : response && <Response response={response} />}
                    <Rating rating={overallRatings} data={data} chartId="Positivity Chart"/>
                </div>
                <div>
                    <Bottom tabURL={amazonUrl} overallRatings={overallRatings} />
                </div>
            </Container.Inner>
            <Footer />
        </Container.Outer>
    );
}

export default Extension;
